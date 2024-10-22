const express = require('express');
const  reviewController  = require('../controllers/reviewController');
const router = express.Router()

const {getAllReviews} = reviewController

router.route('/').get(getAllReviews)

module.exports = router