const express = require("express");
const tourController = require("./../controllers/ToursController");


const authController = require("../controllers/authController");
const reviewRouter = require('./reviewRoute')
const router = express.Router();

const { getAllTours,getTour,aliasTopTours,updateTour,deleteTour,createTour } = tourController;
const {protect,restrictTo} = authController




router.use('/:tourId/reviews', reviewRouter)
router.route('/top-5-cheap').get(aliasTopTours,getAllTours)

router.route("/").get(protect,getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(protect,restrictTo('admin','lead-guide'),deleteTour)



module.exports = router;
