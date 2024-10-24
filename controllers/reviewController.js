const Review = require("../models/reviewModel");
const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("./catchAsync");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const Feature = new APIFeatures(Review.find(), req.query)
    .sort()
    .filter()
    .limit()
    .field()
    .paginate();
  const reviews = await Feature.query;
  if (!reviews) return next(new AppError("Cannot find reviews", 404));
  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review)
    return next(new AppError("Cannot find review with that ID: ", 404));

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

exports.createReview = catchAsync(async(req,res,next)=>{
  if(!req.body.user) req.body.user = req.user.id
  if(!req.body.tour) req.body.tour = req.params.tourId
  const newReview = await Review.create(req.body)

  res.status(200).json({
    status: 'success',
    data: {
      newReview
    }
  })
})