const express = require('express')
const {
  getUser,
  updateDisplayName,
  updateProfileImage,
  updateEmail,
  updatePassword,
  resetProfileImage,
} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

const userRouter = express.Router()

// Get user
userRouter.get('/', requireAuth, getUser)

// Update display name
userRouter.patch('/update-displayname', requireAuth, updateDisplayName)

// Update profile image
userRouter.patch('/update-profile-image', requireAuth, updateProfileImage)

// Update email
userRouter.patch('/update-email', requireAuth, updateEmail)

// Update password
userRouter.patch('/update-password', requireAuth, updatePassword)

// Reset profile image
userRouter.delete('/reset-profile-image', requireAuth, resetProfileImage)

module.exports = userRouter