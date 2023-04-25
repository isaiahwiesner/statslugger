require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' })
  }
  const token = authorization.split(' ')[1]
  try {
    const { uid } = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
    const user = await User.findOne({ uid }).select('-password -_id -__v')
    req.user = user._doc
    next()
  } catch (e) {
    res.status(401).json({ error: 'Request is not authorized' })
  }
}

module.exports = requireAuth