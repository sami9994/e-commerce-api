const mongoose = require('mongoose')

const Review = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'please provide the title'],
      max: [100, 'the title cant be more than 100 character'],
    },
    comment: {
      type: String,
      required: [true, 'please provide comment field'],
    },
    user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
)
//function that make the user write comment
Review.index({ product: 1, user: 1 }, { unique: true })
Review.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ])
  try {
    console.log(result)
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    )
  } catch (error) {
    console.log(error)
  }
}
Review.post('post', async function () {
  await this.constructor.calculateAverageRating(this.product)
})
Review.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product)
})
Review.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product)
})
module.exports = mongoose.model('Review', Review)
