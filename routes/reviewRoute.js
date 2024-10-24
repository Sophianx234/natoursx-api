const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");
const router = express.Router({mergeParams: true});

const { getAllReviews, getReview,createReview} = reviewController;
const { protect } = authController;

router.route("/").get(getAllReviews).post(protect, createReview);
module.exports = router;
