const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");
const router = express.Router({mergeParams: true});

const { getAllReviews, getReview,createReview, updateReview} = reviewController;
const { protect } = authController;

router.route("/").get(getAllReviews).post(protect, createReview);

router.route('/:id').patch(updateReview)