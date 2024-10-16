const Tour = require("../models/ToursModel");
const APIFeatures = require("../utils/APIFeatures");
exports.aliasTopTours = (req,res,next)=>{
  req.query.limit= '5';
  req.query.sort = 'price,ratingsAverage'
  req.query.field = 'name,price,duration'
  next()
}

exports.getAllTours = async (req, res) => {

  
/*  

  if (req.query.field) {
    const fields = req.query.field.split(",").join(" ");
    query = query.select(fields)
  }
  let limit;
  if(req.query.limit){
    limit = +req.query.limit
    query = query.limit(limit)
  }
  if(req.query.page ){
      const page = +req.query.page
      const skip = (page-1)*limit;
      query = query.skip(skip)
    } */
   const features = new APIFeatures(Tour.find(),req.query).filter().sort().limit().field().paginate()
  const tours = await features.query;
  res.status(200).json({
    status: "success",
    result: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = async (req, res) => {
  const id = req.params.id;
  const tour = await Tour.findById(id);
  res.status(200).json({
    status: "success",
    tour,
  });
};
exports.updateTour = async(req,res)=>{
  try{

    const id = req.params.id
    const {name,price,duration,difficulty} = req.body
    console.log('id: ', id)
    const tour = await Tour.findByIdAndUpdate(id,{name,price,duration,difficulty},{new:true})
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  }catch(err){
    res.json({
      status: 'fail',
      message: err.message
    })
  }
}

exports.deleteTour = async(req,res)=>{
  const {id} = req.params
  await Tour.findByIdAndDelete(id)
  res.status(200).json({
    status: 'success',
    data: null
  })
}
