const express = require("express");
const app = express();
const morgan = require("morgan");

const tourRouter = require("./routes/ToursRoute");
const userRouter = require("./routes/userRoute");
const AppError = require("./utils/AppError");
const errorController = require("./controllers/errorController");


app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);


app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
