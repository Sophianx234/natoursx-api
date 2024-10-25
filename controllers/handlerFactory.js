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

exports.updateOne = model => catchAsync(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const id = req.params.id;
    const doc = await model.findByIdAndUpdate(
      id,
      { name, password, email, passwordConfirm },
      { new: true }
    );
    if (!doc) return next(new AppError("can't find document with that ID", 404));
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });