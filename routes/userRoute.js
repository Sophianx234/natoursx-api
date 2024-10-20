const express = require('express');
const userController = require('../controllers/authController');
const router = express.Router()
const { getAllUsers,updateUser,getUser,login,signup,deleteUser,protect,forgotPassword,resetPassword,updatePassword } = userController
router.post('/forgotPassword',forgotPassword)
router.patch('/resetPassword/:token',resetPassword)
router.patch('/updateMyPassword',protect,updatePassword)
router.post('/signup',signup)
router.post('/login',login)
router.route('/').get(getAllUsers)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)


module.exports = router