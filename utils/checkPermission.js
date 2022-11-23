const CustomError = require('../errors')
const checkPermissions = (requestUser, resourceUserId) => {
  // console.log(requestUser)
  // console.log(resourceUserId)
  // console.log(typeof resourceUserId)
  if (requestUser.role === 'admin') return
  if (requestUser.requestUserId === resourceUserId.toString()) return
  throw new CustomError.UnauthorizedError('you cannot access this route ')
}
module.exports = checkPermissions
