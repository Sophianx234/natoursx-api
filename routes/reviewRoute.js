const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");
const router = express.Router();

const { getAllReviews, getReview,createReview} = reviewController;
const { protect } = authController;

router.route("/").get(protect, getAllReviews).post(createReview);
router.route("/:id").get( getReview);
module.exports = router;
