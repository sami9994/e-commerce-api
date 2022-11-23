const CustomErr = require('../errors')
const { isTokenValid } = require('../utils')
const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new CustomErr.UnauthenticatedError('Authentication Invalid')
  }
  try {
    const { name, role, userId } = isTokenValid({ token })
    req.user = { name, role, userId }
    next()
  } catch (error) {}
}
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErr.UnauthorizedError('Unauthorized to access route')
    }
    next()
  }
}

module.exports = {
  authenticateUser,
  authorizePermissions,
}
