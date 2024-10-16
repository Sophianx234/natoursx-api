const jwt = require('jsonwebtoken')
const {promisify} = require('util')


const User = require("../models/userModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("./catchAsync");
const AppError = require("../utils/AppError");


const signToken = (user)=>{
    return jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN})
}
exports.getAllUsers = catchAsync(async(req,res,next)=>{
    const features = new APIFeatures(User.find(),req.query).sort().field().limit().paginate()
    const users = await features.query;
    if(!users) return next(new AppError("can't find user with that ID",404))
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    })
})

exports.updateUser = catchAsync(async(req,res,next)=>{
    const {name,email,password,passwordConfirm} = req.body
    const id = req.params.id
    const user = await User.findByIdAndUpdate(id,{name,password,email,passwordConfirm},{new:true})
    if(!user) return next(new AppError("can't find user with that ID",404))
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})
exports.getUser = catchAsync(async(req,res,next)=>{
    const id = req.params.id;
    const features = new APIFeatures(User.findById(id),req.query).field()
    const user = await features.query
    if(!user) return next(new AppError("can't find user with that ID",404))
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.signup = catchAsync(async(req,res,next)=>{
    const {name,email,password,passwordConfirm} = req.body
    const newUser = await User.create({name,password,passwordConfirm,email})
    const token = signToken(newUser)
    res.status(200).json({
        status: 'success',
        token,
        data: {
            newUser
        }
    })

})

exports.deleteUser = catchAsync(async(req,res,next)=>{
    const user = await User.findByIdAndDelete(req.params.id)
     if(!user) return next(new AppError("can't find user with that ID",404))
    res.status(501).json({
        status: 'success',
        data: null
    })
})

exports.login = catchAsync(async(req,res,next)=>{
    const {email,password}= req.body;
    if(!email || !password) return next(new AppError('invalid email or password'))
    const user = await User.findOne({email}).select('+password')
    if(!user || !(await user.correctPassword(password,user.password))) return next(new AppError('incorrect email or password'))
    const token = signToken(user)
    res.status(200).json({
        status: 'success',
        token
    })
        
    

})

exports.protect = catchAsync(async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        token = req.headers.authorization.split(' ')[1].trim()

    }
    if(!token)return next(new AppError('You are not logged in! please login to access route:D',401))
        const decoded = await jwt
    .verify(token,process.env.JWT_SECRET)
console.log('token',decoded)
console.log('token',process.env.JWT_SECRET)


    const currentUser = await User.findById(decoded
    )
    if(!currentUser){
        return next(new AppError('The user belonging to this token no longer exist',401))
    }
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password please login again',401))

    }
    req.user = currentUser
    next()
})