const express = require("express");
const tourController = require("./../controllers/ToursController");
const router = express.Router();

const { getAllTours,getTour } = tourController;
router.route("/").get(getAllTours);
router.route('/:id').get(getTour)


module.exports = router;
