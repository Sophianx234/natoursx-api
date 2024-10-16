const express = require("express");
const tourRouter = require("./routes/ToursRoute");
const app = express();
const morgan = require("morgan");
const AppError = require("./utils/AppError");
const errorController = require("./controllers/errorController");
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/tours", tourRouter);
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
});

app.use(errorController);

module.exports = app;
