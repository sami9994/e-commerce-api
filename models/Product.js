const mongoose = require('mongoose')

const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'please provide the name of product'],
      maxlength: [100, 'the cannot be greater than 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'please provide price '],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'please provide the description of product'],
      maxlength: [100, 'the description cannot be greater than 100 characters'],
    },
    image: { type: String, default: '/upload/example.jpg' },
    category: {
      type: String,
      enum: ['kitchen', 'office', 'bedroom'],
      required: [true, 'please provide the category of product'],
    },
    company: {
      type: String,
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
      required: [true, 'please provide the company of product'],
    },
    colors: { type: [String], required: true, default: ['#fff'] },
    featured: { type: Boolean, required: true, default: false },
    freeShipping: { type: Boolean, default: true },
    inventory: {
      type: Number,
      required: true,
      default: 50,
    },
    averageRating: { type: Number, default: 0 },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)
Product.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
})
// this function is used to remove the reviews which are associated to the product we want to delete
Product.pre('remove', async function (next) {
  await this.model('Review').deleteMany({
    product: this._id,
  })
})
module.exports = mongoose.model('Product', Product)
