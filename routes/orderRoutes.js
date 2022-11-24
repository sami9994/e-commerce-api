const {
  getAllOrders,
  getCurrentOrder,
  getSingleOrder,
  updateOrder,
  createOrder,
} = require('../controllers/orderController')
const express = require('express')
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')
const router = express.Router()
router
  .route('/')
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermissions('admin'), getAllOrders)
router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)
router.route('/showAllMyOrders').get(authenticateUser, getCurrentOrder)
module.exports = router
