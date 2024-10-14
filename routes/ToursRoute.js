const express = require("express");
const tourController = require("./../controllers/ToursController");
const router = express.Router();

const { getAllTours } = tourController;
router.route("/").get(getAllTours);


module.exports = router;
