const express = require('express');
const userController = require('../controllers/authController');
const router = express.Router()
const { getAllUsers,updateUser,getUser,login,signup,deleteUser } = userController
router.route('/').get(getAllUsers)
router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)


module.exports = router