require('dotenv').config()
// express
const express = require('express')
const app = express()
//morgan bundle
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
//database
const connectDB = require('./db/connect.js')
//middle ware
const notFoundMiddleware = require('./middleware/not-found.js')
const errorHandlerMiddleware = require('./middleware/error-handler.js')
const authRouter = require('./routes/authRoutes.js')
const userRouter = require('./routes/usersRoutes.js')
const productRouter = require('./routes/productRoutes')
const reviewsRouter = require('./routes/reviewRoutes.js')

app.use(morgan('tiny')) // it used console the request method and the path and the response status
app.use(express.json()) //to get data from page
app.use(cookieParser(process.env.JWT_SECRET))
//first step to upload image
app.use(express.static('./public'))
app.use(fileUpload())
app.get('/', (req, res) => {
  console.log(req.signedCookies)
  res.send('hello e-commerce')
})
app.get('/api/v1/auth', (req, res) => {
  console.log(req.cookies)
  res.send('hello e-commerce')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/reviews', reviewsRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
const Port = process.env.Port || 4000
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(Port, () => {
      console.log('listening to 5000')
    })
  } catch (error) {
    console.log(error)
  }
}

start()
