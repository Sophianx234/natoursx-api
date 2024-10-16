module.exports = (err, req, res,next) => {
    
    err.statusCode = err.StatusCode || 404;
    err.status = err.status || 'fail'
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
    
    
  }