const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require('crypto')
const User = require("../models/userModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("./catchAsync");
const AppError = require("../utils/AppError");
const { reset } = require("nodemon");
const sendEmail = require("../utils/email");

const signToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .sort()
    .field()
    .limit()
    .paginate();
  const users = await features.query;
  if (!users) return next(new AppError("can't find user with that ID", 404));
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const id = req.params.id;
  const user = await User.findByIdAndUpdate(
    id,
    { name, password, email, passwordConfirm },
    { new: true }
  );
  if (!user) return next(new AppError("can't find user with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.getUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const features = new APIFeatures(User.findById(id), req.query).field();
  const user = await features.query;
  if (!user) return next(new AppError("can't find user with that ID", 404));
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    name,
    password,
    passwordConfirm,
    email,
    role,
  });
  const token = signToken(newUser);
  req.user = newUser
  console.log(req.user)
  res.status(200).json({
    status: "success",
    token,
    data: {
      newUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError("can't find user with that ID", 404));
  res.status(501).json({
    status: "success",
    data: null,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("invalid email or password"));
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("incorrect email or password"));
  const token = signToken(user);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(
      new AppError("You are not logged in! please login to access route:D", 401)
    );
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exist", 401)
    );
  }
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password please login again", 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this function", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next("There is no user with that email address", 404);
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  console.log(req.protocol);
  console.log(req.get("host"));

  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetpassword/${resetToken}`;
  const message = `Forgot your password? submit a patch request with your new password and passwordConfirm to : ${resetURL}\n if you didn't forget your password please ignore this message`;

  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset token (valid for 10 mins)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. please try again later",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async(req,res,next)=>{
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    console.log(hashedToken)
    const user = await User.findOne({passwordResetToken:hashedToken, passwordResetExpires: {$gt: Date.now()}})
    console.log(user)
    if(!user){
        return next(new AppError('Token is invalid or expired',404))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    const token = signToken(user)
    res.status(200).json({
        status: 'success',
        token
    })


})

exports.updateUserPassword = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password')
    console.log('req.user', req.user)
    const {password,passwordCurrent,passwordConfirm} = req.body
    if(!(await user.correctPassword(passwordCurrent, user.password))){
        return next(new AppError('Invalid username or password',404))
    }
    user.password = password 
    user.passwordConfirm = passwordConfirm
    await user.save()
    const token = signToken(user)
    res.status(200).json({
        status: 'success',
        token
    })

    
    
})

exports.deleteMe = catchAsync(async(req,res,next)=>{
  if(!req.user.id){
    return next(new AppError('You do not have permission to perform this action! Please login'))
  }
  
  await User.findByIdAndUpdate(req.user.id,{active:false})
  res.status(204).json({
    status: 'success',
    data: null
  })
  
  })
