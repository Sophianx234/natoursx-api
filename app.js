const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const errorController = require("./controllers/errorController");
const tourRouter = require("./routes/ToursRoute");
const userRouter = require("./routes/userRoute");
const AppError = require("./utils/AppError");
const rateLimit = require("express-rate-limit");

const limit = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: "Too many request from this IP! please try again in an hour!",
});
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "maxGroupSize",
      "difficulty",
      "ratingsAverage",
      "ratingsQuantity",
      "price",
    ],
  })
);
app.use("/api", limit);
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorController);

module.exports = app;
