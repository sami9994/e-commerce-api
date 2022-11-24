const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path')
const createProduct = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({ product })
}
const getSingleProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findOne({ _id: id }).populate('reviews')
  if (!product) {
    throw new CustomError.NotFoundError('no products founds')
  }
  res.status(StatusCodes.OK).json({ product })
}
const getAllProducts = async (req, res) => {
  const products = await Product.find({})
  if (!products) {
    throw new CustomError.NotFoundError('no products founds')
  }
  res.status(StatusCodes.OK).json({ products })
}
const updateProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) {
    throw new CustomError.NotFoundError('no products founds')
  }
  res.status(StatusCodes.OK).json({ product })
}
const deleteProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findOne({ _id: id })
  if (!product) {
    throw new CustomError.NotFoundError(`no product founds with id : ${id}`)
  }
  // its important because it will trigger Review model to delete the relative reviews for specific product
  await product.remove()
  res
    .status(StatusCodes.OK)
    .json({ msg: `the product with id : ${id} has been deleted successfully` })
}
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError('no file uploaded')
  }
  const productImage = req.files.image
  // console.log(productImage)
  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError('please upload image')
  }
  const maxSize = 1024 * 1024
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequestError(
      'please upload image smaller than 1MB'
    )
  }
  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  )
  await productImage.mv(imagePath)
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` })
  res.send('upload Image')
}
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  uploadImage,
  updateProduct,
  deleteProduct,
}
