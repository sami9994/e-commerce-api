const Product = require('../models/Product')
const Review = require('../models/Review')
const Order = require('../models/Order')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const checkPermissions = require('../utils/checkPermission')

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = 'some values'
  return { clientSecret, amount }
}

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError('no cart items ')
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError('pleas provide tax shipping fee')
  }
  let orderItems = []
  let subTotal = 0
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new CustomError.NotFoundError(`no product with id ${item.product}`)
    }

    const { name, price, image, _id } = dbProduct

    const singleOrderItem = {
      amount: item.amount,
      productId: _id,
      price,
      name,
      image,
    }
    // add item to order items
    orderItems = [...orderItems, singleOrderItem]
    subTotal += price * singleOrderItem.amount
  }

  const total = tax + shippingFee + subTotal
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  })

  const order = await Order.create({
    orderItems,
    total,
    tax,
    shippingFee,
    subTotal,
    user: req.user.userId,
    clientSecret: paymentIntent.clientSecret,
  })
  res.status(StatusCodes.OK).json({ order })
}
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}
const getSingleOrder = async (req, res) => {
  const { id } = req.params
  const order = await Order.findOne({ _id: id })
  if (!order) {
    throw new CustomError.NotFoundError(`no product with id ${item.product}`)
  }
  checkPermissions(req.user, order.user)
  res.status(StatusCodes.OK).json({ order })
}
const getCurrentOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId.toString() })
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const updateOrder = async (req, res) => {
  const { id } = req.params
  const { paymentIntentId } = req.body
  const order = await Order.findOne({ _id: id })
  if (!order) {
    throw new CustomError.NotFoundError(`no product with id ${item.product}`)
  }
  checkPermissions(req.user, order.user)
  order.paymentIntentId = paymentIntentId
  order.status = 'paid'
  await order.save()
  res.status(StatusCodes.OK).json({ order })
}
module.exports = {
  getAllOrders,
  getCurrentOrders,
  getSingleOrder,
  updateOrder,
  createOrder,
}
