const User = require('../models/User.js')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { use } = require('../routes/authRoutes.js')
const { startSession } = require('../models/User.js')
const { createTokenUser, attachCookiesToResponse } = require('../utils')
const register = async (req, res) => {
  const { name, email, password } = req.body
  const isFirstUser = await User.countDocuments({})
  const role = isFirstUser === 0 ? 'admin' : 'user'
  const user = await User.create({ name, email, password, role })
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(200).json({ user: tokenUser })
}
const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new CustomError.BadRequestError('please provide email and password ')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.UnauthenticatedError('invalid credentials')
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('invalid credentials')
  }
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse({ res, user: tokenUser })

  res.status(201).json({ user: tokenUser })
}
const logout = async (req, res) => {
  console.log('logged out')
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(200).json({ msg: 'successfully logged out' })
}
module.exports = { login, logout, register }
