const Tour = require("../models/ToursModel");
const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require('./catchAsync');
const { updateOne } = require("./handlerFactory");


exports.aliasTopTours = (req,res,next)=>{
  req.query.limit= '5';
  req.query.sort = 'price,ratingsAverage'
  req.query.field = 'name,price,duration'
  
}

exports.getAllTours = catchAsync( async (req, res,next) => {

   const features = new APIFeatures(Tour.find(),req.query).filter().sort().field().limit().paginate()
  const tours = await features.query;
  if(!tours) return next(new AppError('Tours do not exist',404))
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours,
    }
  });
});

exports.getTour = catchAsync( async (req, res,next) => {
  const id = req.params.id;
  const tour = await Tour.findById(id).populate('reviews');
  if(!tour) return next(new AppError(`No tour found with that ID`,404))
  res.status(200).json({
    status: "success",
    tour,
  });
});
exports.updateTour = async(req,res)=>{
  

    const id = req.params.id
    const {name,price,duration,difficulty} = req.body
    console.log('id: ', id)
    const tour = await Tour.findByIdAndUpdate(id,{name,price,duration,difficulty},{new:true})
    if(!tour) return next(new AppError(`No tour found with that ID`,404))
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  
}

exports.updateTour = updateOne(Tour)

exports.createTour = catchAsync(async(req,res,next)=>{
  const tour = await Tour.create(req.body)
  if(!tour) return next(new AppError('could not create Tour',404))
    res.status(200).json({
  status: 'success',
  tour
})
})