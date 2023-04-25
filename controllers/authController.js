require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')
const User = require('../models/userModel')
const { sendPasswordResetEmail } = require('../utils/sendEmail')

// Log in
const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.login({ email, password })
    res.status(200).json(user)
  } catch (e) {
    let json = { error: e.message }
    if (e.errorFields) json.errorFields = e.errorFields
    res.status(400).json(json)
  }
}

// Sign up
const signup = async (req, res) => {
  const { displayName, email, password, confirmPassword } = req.body
  try {
    const user = await User.signup({ displayName, email, password, confirmPassword })
    res.status(200).json(user)
  } catch (e) {
    let json = { error: e.message }
    if (e.errorFields) json.errorFields = e.errorFields
    res.status(400).json(json)
  }
}

// Send email confirmation
const sendEmailConfirmation = async (req, res) => {
  const user = req.user
  try {
    await User.sendConfirmation(user)
    res.status(200).json({ msg: 'Confirmation email sent' })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}

// Confirm email
const confirmEmail = async (req, res) => {
  const user = req.user
  const { token } = req.query
  if (user.emailVerified) {
    return res.status(400).json({ error: 'Email already verified' })
  }
  try {
    await User.confirmEmail(user, token)
    const { email } = user
    res.status(200).json({ msg: 'Email verified', email, emailVerified: true })
  } catch (e) {
    if (e.message.includes('jwt expired')) {
      return res.status(400).json({ error: 'Token expired' })
    }
    res.status(400).json({ error: 'Invalid token' })
  }
}

// Send password reset email
const passwordReset = async (req, res) => {
  const genResetToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_RESET_SECRET, { expiresIn: '10m' })
  }
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Please fill in all fields', errorFields: ['email'] })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Email not in use', errorFields: ['email'] })
    }
    const { displayName } = user
    const token = genResetToken(email)
    const link = process.env.WEBSITE_URL + '/reset-password/' + token
    await sendPasswordResetEmail({ email, displayName, link })
    res.status(200).json({ msg: 'Password reset email sent' })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}

// Validate password reset token
const validatePasswordReset = async (req, res) => {
  const { token } = req.query
  try {
    const { email } = jwt.verify(token, process.env.JWT_RESET_SECRET)
    if (!email) {
      return res.status(400).json({ error: 'Invalid token' })
    }
    res.sendStatus(200)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}

// Handle password reset
const handlePasswordReset = async (req, res) => {
  const { token, password, confirmPassword } = req.body
  let emptyFields = []
  if (!token) emptyFields.push('token')
  if (!password) emptyFields.push('password')
  if (!confirmPassword) emptyFields.push('confirmPassword')
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', errorFields: emptyFields })
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match', errorFields: ['password', 'confirmPassword'] })
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ error: 'Password too weak', errorFields: ['password', 'confirmPassword'] })
  }
  try {
    const { email } = jwt.verify(token, process.env.JWT_RESET_SECRET)
    if (!email) {
      return res.status(400).json({ error: 'Invalid token' })
    }
    const user = await User.findOne({ email })
    if (await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Password cannot match current password', errorFields: ['password', 'confirmPassword'] })
    }
    const hashedPass = await bcrypt.hash(password, 10)
    await User.updateOne({ email }, { password: hashedPass })
    res.status(200).json({ msg: 'Password changed', email })
  } catch (e) {
    if (e.message.includes('jwt expired')) {
      return res.status(400).json({ error: 'Token expired' })
    }
    res.status(400).json({ error: e.message })
  }
}

// Export
module.exports = {
  login,
  signup,
  sendEmailConfirmation,
  confirmEmail,
  passwordReset,
  validatePasswordReset,
  handlePasswordReset,
}