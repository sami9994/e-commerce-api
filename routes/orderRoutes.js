const {
  getAllOrders,
  getCurrentOrders,
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
router.route('/showAllMyOrders').get(authenticateUser, getCurrentOrders)
router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)
module.exports = router
