require('dotenv').config()
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { sendConfirmationEmail } = require('../utils/sendEmail')

const Schema = mongoose.Schema

const userSchema = new Schema({
  displayName: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
    default: null,
  },
  group: {
    type: String,
    required: true,
    default: 'user',
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { timestamps: true })

// Generate access token
const genAccessToken = (uid) => {
  return jwt.sign({ uid }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '3d' })
}
// Generate confirmation link
const genConfirmationLink = (uid) => {
  return jwt.sign({ uid }, process.env.JWT_CONFIRMATION_SECRET, { expiresIn: '10m' })
}
// Generate UID
const genUID = () => {
  return [...Array(32)].map(() => {
    const char = Math.floor(Math.random() * 36).toString(36)
    if (Math.floor(Math.random() * 2) === 0) {
      return char
    }
    else {
      return char.toUpperCase()
    }
  }).join('')
}

// Static log in method
userSchema.statics.login = async function (data) {
  const { email, password } = data
  let emptyFields = []
  if (!email) emptyFields.push('email')
  if (!password) emptyFields.push('password')
  if (emptyFields.length > 0) {
    throw { message: 'Please fill in all fields', errorFields: emptyFields }
  }
  if (!validator.isEmail(email)) {
    throw { message: 'Invalid email', errorFields: ['email'] }
  }
  const match = await this.findOne({ email })
  if (!match) {
    throw { message: 'Email not in use', errorFields: ['email'] }
  }
  if (!await bcrypt.compare(password, match.password)) {
    throw { message: 'Incorrect password', errorFields: ['password'] }
  }
  const user = await this.findOne({ email }).select('-_id -password -__v')
  const accessToken = genAccessToken(user.uid)
  return { ...user._doc, accessToken }
}

// Static sign up method
userSchema.statics.signup = async function (data) {
  const { displayName, email, password, confirmPassword } = data
  let emptyFields = []
  if (!displayName) emptyFields.push('displayName')
  if (!email) emptyFields.push('email')
  if (!password) emptyFields.push('password')
  if (!confirmPassword) emptyFields.push('confirmPassword')
  if (emptyFields.length > 0) {
    throw { message: 'Please fill in all fields', errorFields: emptyFields }
  }
  if (!validator.isEmail(email)) {
    throw { message: 'Invalid email', errorFields: ['email'] }
  }
  if (password !== confirmPassword) {
    throw { message: 'Passwords do not match', errorFields: ['password', 'confirmPassword'] }
  }
  if (!validator.isStrongPassword(password)) {
    throw { message: 'Password too weak', errorFields: ['password', 'confirmPassword'] }
  }
  const exists = await this.findOne({ email })
  if (exists) {
    throw { message: 'Email already in use' }
  }
  const hashedPass = await bcrypt.hash(password, 10)
  await this.create({
    displayName,
    uid: genUID(),
    email,
    password: hashedPass,
  })
  const user = await this.findOne({ email }).select('-password -_id -__v')
  const accessToken = genAccessToken(user.uid)
  await this.sendConfirmation(email)
  return { ...user._doc, accessToken }
}

// Static send confirmation email method
userSchema.statics.sendConfirmation = async function (user) {
  const { email, displayName, emailVerified, uid } = user
  if (emailVerified) {
    throw Error('Email already verified')
  }
  const token = genConfirmationLink(uid)
  const link = process.env.WEBSITE_URL + '/emailconfirmation/' + token
  return await sendConfirmationEmail({ email, displayName, link })
}

// Static confirm email method
userSchema.statics.confirmEmail = async function (user, token) {
  if (!token) {
    throw Error('Token is required')
  }
  const { uid } = jwt.verify(token, process.env.JWT_CONFIRMATION_SECRET)
  if (user.uid !== uid) {
    throw Error('Token does not match user')
  }
  return await this.updateOne({ uid }, { emailVerified: true })
}

// Export
module.exports = mongoose.model('User', userSchema)