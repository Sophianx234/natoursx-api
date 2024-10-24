const AppError = require("../utils/AppError")
const catchAsync = require("./catchAsync")


exports.deleteOne = model => catchAsync(async(req,res,next)=>{
    const doc = await model.findByIdAndDelete(req.params.id)
    if(!doc) return next(new AppError(`No document found with that ID:`,404))
    res.status(204).json({
      status: 'success',
      data: null
    })
})
