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
module.exports = mongoose.model('Review', Review)
