const User = require("../models/userModel");
const APIFeatures = require("../utils/APIFeatures");
const catchAsync = require("./CatchAsync");

exports.getAllUsers = catchAsync(async(req,res,next)=>{
    const features = new APIFeatures(User.find(),req.query).sort().field().limit().paginate()
    const users = await features.query;
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
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })
})

exports.signup = catchAsync(async(req,res,next)=>{
    const {name,email,password,passwordConfirm} = req.body
    const user = await User.create({name,password,passwordConfirm,email})
    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    })

})

exports.deleteUser = catchAsync(async(req,res,next)=>{
     await User.findByIdAndDelete(req.params.id)
    res.status(501).json({
        status: 'success',
        data: null
    })
})