const validator = require('validator')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const isImage = require('../utils/isImage')
const { sendPasswordChangedEmail } = require('../utils/sendEmail')

// Get user
const getUser = async (req, res) => {
  const { uid } = req.user
  const user = await User.findOne({ uid }).select('-password -_id -__v')
  res.status(200).json({ ...user._doc })
}

// Update display name
const updateDisplayName = async (req, res) => {
  const { displayName } = req.body
  const { uid } = req.user
  if (!displayName) {
    return res.status(400).json({ error: 'Please fill in all fields', errorFields: ['displayName'] })
  }
  if (displayName.length > 50) {
    return res.status(400).json({ error: 'Display name may not exceed 50 characters', errorFields: ['displayName'] })
  }
  await User.updateOne({ uid }, { displayName })
  res.status(200).json({ msg: 'Display name updated', displayName })
}

// Update profile image
const updateProfileImage = async (req, res) => {
  const { photoURL } = req.body
  const { uid } = req.user
  if (!photoURL) {
    return res.status(400).json({ error: 'Please fill in all fields', errorFields: ['photoURL'] })
  }
  const photoValid = await isImage(photoURL)
  if (!photoValid) {
    return res.status(400).json({ error: 'Invalid photo url', errorFields: ['photoURL'] })
  }
  await User.updateOne({ uid }, { photoURL })
  res.status(200).json({ msg: 'Profile image updated', photoURL })
}

// Update email
const updateEmail = async (req, res) => {
  const { email, password } = req.body
  const { uid } = req.user
  let emptyFields = []
  if (!email) emptyFields.push('email')
  if (!password) emptyFields.push('password')
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', errorFields: emptyFields })
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email', errorFields: ['email'] })
  }
  const exists = await User.findOne({ email })
  if (exists) {
    return res.status(400).json({ error: 'Email already in use', errorFields: ['email'] })
  }
  const user = await User.findOne({ uid })
  const { displayName } = user
  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).json({ error: 'Incorrect password', errorFields: ['password'] })
  }
  await User.updateOne({ uid }, { email, emailVerified: false })
  await User.sendConfirmation({ email, displayName, emailVerified: false, uid })
  res.status(200).json({ msg: 'Email updated', email })
}

// Update password
const updatePassword = async (req, res) => {
  const { currentPassword, password, confirmPassword } = req.body
  const { uid, email, displayName } = req.user
  let emptyFields = []
  if (!currentPassword) emptyFields.push('currentPassword')
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
  const user = await User.findOne({ uid })
  if (!await bcrypt.compare(currentPassword, user.password)) {
    return res.status(400).json({ error: 'Incorrect password', errorFields: ['currentPassword'] })
  }
  if (currentPassword === password) {
    return res.status(400).json({ error: 'New password cannot match old password', errorFields: ['currentPassword', 'password', 'confirmPassword'] })
  }
  const hashedPass = await bcrypt.hash(password, 10)
  await User.updateOne({ uid }, { password: hashedPass })
  await sendPasswordChangedEmail({ email, displayName })
  res.status(200).json({ msg: 'Password updated', email })
}

// Reset profile image
const resetProfileImage = async(req, res) => {
  const { uid } = req.user
  await User.updateOne({ uid }, { photoURL: null })
  return res.status(200).json({ msg: 'Profile image reset', photoURL: null })
}


module.exports = {
  getUser,
  updateDisplayName,
  updateProfileImage,
  updateEmail,
  updatePassword,
  resetProfileImage,
}