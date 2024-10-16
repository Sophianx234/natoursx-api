const express = require('express');
const userController = require('../controllers/authController');
const router = express.Router()
const { getAllUsers,updateUser,getUser } = userController
router.route('/').get(getAllUsers)
router.route('/:id').get(getUser).patch(updateUser)


module.exports = router