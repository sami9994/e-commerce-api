const Product = require('../models/Product')
const Review = require('../models/Review')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

const checkPermissions = require('../utils/checkPermission.js')
const createReview = async (req, res) => {
  const { product: productId } = req.body

  console.log(req.user)
  const isValidProduct = await Product.findOne({ _id: productId })
  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id ${productId}`)
  }
  const alreadySubmitted = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })
  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      `Already submitted review for this product `
    )
  }
  req.body.user = req.user.userId
  const review = await Review.create(req.body)
  res.status(StatusCodes.CREATED).json({ review })
}
const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name price company',
  })

  res.status(StatusCodes.OK).json({ reviews })
}
const getSingleReview = async (req, res) => {
  const id = req.params.id
  const review = await Review.findOne({ _id: id })
  if (!review) {
    throw new CustomError.NotFoundError(`no review with this id ${id}`)
  }
  res.status(StatusCodes.OK).json({ review })
}
const updateReview = async (req, res) => {
  const id = req.params.id
  const { rating, title, comment } = req.body
  const review = await Review.findOne({ _id: id })
  if (!review) {
    throw new CustomError.NotFoundError(`no review with this id ${id}`)
  }
  console.log('req', req.user)
  console.log('review', review.user.toString())
  checkPermissions(req.user, review.user)
  review.rating = rating
  review.title = title
  review.comment = comment
  await review.save()
  res
    .status(StatusCodes.OK)
    .json({ msg: `review has been updated successfully`, review })
}
const deleteReview = async (req, res) => {
  const id = req.params.id
  const review = await Review.findOne({ _id: id })
  if (!review) {
    throw new CustomError.NotFoundError(`no review with this id ${id}`)
  }
  checkPermissions(req.user, review.user)
  await review.remove()
  res
    .status(StatusCodes.OK)
    .json({ msg: `review has been deleted successfully` })
}
const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
module.exports = {
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  createReview,
  getSingleProductReviews,
}
