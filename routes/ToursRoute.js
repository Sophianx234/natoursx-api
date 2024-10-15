const express = require("express");
const tourController = require("./../controllers/ToursController");
const router = express.Router();

const { getAllTours,getTour,aliasTopTours,updateTour,deleteTour } = tourController;
router.route('/top-5-cheap').get(aliasTopTours,getAllTours)
router.route("/").get(getAllTours);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)


module.exports = router;
