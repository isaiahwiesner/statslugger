const express = require('express')
const {
  login,
  signup,
  sendEmailConfirmation,
  confirmEmail,
  passwordReset,
  validatePasswordReset,
  handlePasswordReset,
} = require('../controllers/authController')
const requireAuth = require('../middleware/requireAuth')

const authRouter = express.Router()

// Log in
authRouter.post('/login', login)

// Sign up
authRouter.post('/signup', signup)

// Send confirmation email
authRouter.post('/confirmation-email', requireAuth, sendEmailConfirmation)

// Confirm email
authRouter.get('/confirm-email', requireAuth, confirmEmail)

// Send password reset email
authRouter.post('/password-reset', passwordReset)

// Validate password reset token
authRouter.get('/reset-password', validatePasswordReset)

// Handle password reset
authRouter.post('/reset-password', handlePasswordReset)

module.exports = authRouter