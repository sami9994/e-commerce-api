const express = require('express')
const { authenticateUser } = require('../middleware/authentication')
const {
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  createReview,
} = require('../controllers/reviewController')

const router = express.Router()
router.route('/').post(authenticateUser, createReview).get(getAllReviews)
router
  .route('/:id')
  .delete(authenticateUser, deleteReview)
  .patch(authenticateUser, updateReview)
  .get(authenticateUser, getSingleReview)

module.exports = router
