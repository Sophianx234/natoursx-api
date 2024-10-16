const AppError = require("../utils/AppError");

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({});
  }
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode||500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const handleCastError= (err)=>{
    const message = `invalid ${err.path}: ${err.value}.`
    return new AppError(message,400)
}
module.exports = (err, req, res, next) => {
  

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = {...err}
    if(err.name === 'CastError') error = handleCastError(error)
    sendErrorProd(error, res);
  }
};
