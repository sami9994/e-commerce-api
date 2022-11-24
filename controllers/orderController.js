const Product = require('../models/Product')
const Review = require('../models/Review')
const Order = require('../models/Order')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')

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
  console.log(req.user)
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
  res.send('create')
}
const getSingleOrder = async (req, res) => {
  res.send('create')
}
const getCurrentOrder = async (req, res) => {
  res.send('create')
}
const updateOrder = async (req, res) => {
  res.send('create')
}
module.exports = {
  getAllOrders,
  getCurrentOrder,
  getSingleOrder,
  updateOrder,
  createOrder,
}
