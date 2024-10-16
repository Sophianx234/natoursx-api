const jwt = require('jsonwebtoken')


const User = require("../models/userModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("./catchAsync");
const AppError = require("../utils/AppError");


exports.signToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN})
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
    const token = this.signToken(newUser.__id)
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
    const token = this.signToken(user.__id)
console.log(token)
    res.status(200).json({
        status: 'success',
        token
    })
        
    

})