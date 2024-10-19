const express = require("express");
const tourController = require("./../controllers/ToursController");
const router = express.Router();

const {protect,restrictTo} = require('./../controllers/authController')
const { getAllTours,getTour,aliasTopTours,updateTour,deleteTour } = tourController;
router.route('/top-5-cheap').get(aliasTopTours,getAllTours)
router.route("/").get(protect,getAllTours);
router.route('/:id').get(getTour).patch(updateTour).delete(protect,restrictTo('admin','lead-guide'),deleteTour)


module.exports = router;
