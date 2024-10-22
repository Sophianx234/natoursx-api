const Review = require("../models/reviewModel");
const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("./catchAsync");

exports.getAllReviews = catchAsync(async(req,res,next)=>{
    const Feature = new APIFeatures(Review.find(),req.query).sort().filter().limit().field().paginate();
    const reviews = await Feature.query
    if(!reviews) return next(new AppError('Cannot find reviews', 404))
        res.status(200).json({
    status:'success',
    data: {
        reviews
    }
})
})