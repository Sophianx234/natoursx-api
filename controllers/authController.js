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
    const {name,email,password} = req.body
    const {id} = req.params
    const features = new APIFeatures(User.findByIdAndUpdate(id,{name,password,email},{new:true}),req.query)
    const user = await features.query;
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