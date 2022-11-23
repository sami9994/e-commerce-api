const express = require('express')
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')
const {
  getAllUsers,
  getSingleUser,
  getCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/usersController')

const router = express.Router()
router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin', 'owner'), getAllUsers)

router.route('/showMe').get(authenticateUser, getCurrentUser)
router.route('/updateUser').patch(authenticateUser, updateUser)
router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)
router.get('/:id', authenticateUser, getSingleUser)

module.exports = router
