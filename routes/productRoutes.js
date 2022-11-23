const express = require('express')
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  uploadImage,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')
const { getSingleProductReviews } = require('../controllers/reviewController')
const router = express.Router()
router
  .route('/')
  .get(getAllProducts)
  .post(authenticateUser, authorizePermissions('admin'), createProduct)
router
  .route('/:id')
  .get(getSingleProduct)
  .patch(authenticateUser, authorizePermissions('admin'), updateProduct)
  .delete(authenticateUser, authorizePermissions('admin'), deleteProduct)
router
  .route('/uploadImage')
  .post(authenticateUser, authorizePermissions('admin'), uploadImage)
router.route('/:id/reviews').get(getSingleProductReviews)
module.exports = router
