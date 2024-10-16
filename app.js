const express = require("express");
const tourRouter = require("./routes/ToursRoute");
const app = express();
const morgan = require("morgan");
const AppError = require("./utils/AppError");
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/tours", tourRouter);
app.all("*", (req, res, next) => {
    
    
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
});

app.use((err, req, res) => {
  err.statusCode = err.StatusCode || 404;
  err.status = err.status || 'fail'
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
  
});

module.exports = app;
