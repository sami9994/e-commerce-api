const mongoose = require('mongoose')
const SingleCartItem = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  amount: { type: String, required: true },
  productId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Product',
  },
})
const Order = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    cartItems: [SingleCartItem],
    stats: {
      type: String,
      enum: ['pending', 'failed', 'paid', 'canceled', 'delivered'],
      default: 'pending',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'User',
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
)
module.exports = mongoose.model('Order', Order)
