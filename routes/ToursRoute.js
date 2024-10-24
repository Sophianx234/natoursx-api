const express = require("express");
const tourController = require("./../controllers/ToursController");
const router = express.Router();

 
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");
const { getAllTours,getTour,aliasTopTours,updateTour,deleteTour,createTour } = tourController;
const {createReview} = reviewController
const {protect,restrictTo} = authController



router.route('/top-5-cheap').get(aliasTopTours,getAllTours)
router.route("/").get(protect,getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(protect,restrictTo('admin','lead-guide'),deleteTour)
router.route('/:tourId/reviews').post(protect,createReview)


module.exports = router;
