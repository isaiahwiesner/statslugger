const mongoose = require('mongoose')
const User = require('./userModel')
const isImage = require('../utils/isImage')

const Schema = mongoose.Schema

// Add team option for adding player
// Edit check is staff of team

// Add GET stats when stats model added

// Schema
const playerSchema = new Schema({
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
    default: null,
  },
  creator: {
    type: Map,
    required: true,
  },
  editors: {
    type: Array,
    default: []
  },
  privacy: {
    type: String,
    default: 'public',
  },
}, { timestamps: true })

// Edit check
const canEdit = (player, uid, owner = false) => {
  var allowed = false
  if (owner) {
    if (player.creator.get('uid') && player.creator.get('uid') === uid) allowed = true
  }
  else {
    if (player.creator.get('uid') && player.creator.get('uid') === uid) allowed = true
    if (player.editors && player.editors.includes(uid)) allowed = true
  }
  return allowed
}

// Static add player method
playerSchema.statics.addPlayer = async function (body, user) {
  const { lastName, firstName, number, position, creator, photoURL, privacy } = body
  let emptyFields = []
  if (!lastName) emptyFields.push('lastName')
  if (!firstName) emptyFields.push('firstName')
  if (!number) emptyFields.push('number')
  if (!position) emptyFields.push('position')
  if (!creator) emptyFields.push('creator')
  if (creator && !creator.teamID && !creator.uid) emptyFields.push('creator')
  if (!privacy) emptyFields.push('privacy')
  if (emptyFields.length > 0) {
    throw { message: 'Please fill in all fields', errorFields: emptyFields }
  }
  if (privacy !== 'public' && privacy !== 'private') {
    throw { message: 'Privacy must be set to "public" or "private"', errorFields: ['privacy'] }
  }
  if (creator.teamID) {
    throw Error('Adding to team currently disabled')
  }
  if (creator.uid !== user.uid) {
    throw Error('Cannot create player under another UID')
  }
  const added = await this.create({
    lastName,
    firstName,
    number,
    position,
    creator,
    photoURL: photoURL || null,
    privacy: privacy || 'public'
  })
  const { __v, ...player } = added._doc
  return player
}

// Static get players method
playerSchema.statics.getPlayers = async function(user) {
  const players = await this.find({ $or: [{ 'creator.uid': user.uid }, { editors: user.uid }] }).sort({ lastName: 1, firstName: 1, number: 1 })
  const docs = players.map((player) => {
    const { __v, ...doc } = player._doc
    return doc
  })
  return docs
}

// Static get player method
playerSchema.statics.getPlayer = async function (_id) {
  if (!_id) {
    throw Error('Missing player ID')
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw Error('Invalid player ID')
  }
  const player = await this.findOne({ _id }).select('-__v')
  if (!player) {
    throw Error('No player found')
  }
  return player
}

// Static update player method
playerSchema.statics.updatePlayer = async function (_id, body, user) {
  if (!_id) {
    throw Error('Missing player ID')
  }
  
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw Error('Invalid player ID')
  }
  const player = await this.findOne({ _id })
  if (!player) {
    throw Error('No player found')
  }
  const allowed = canEdit(player, user.uid)
  if (!allowed) {
    throw Error('No access')
  }
  const { lastName, firstName, number, position } = body
  const updates = {}
  if (firstName) updates.firstName = firstName
  if (lastName) updates.lastName = lastName
  if (number) updates.number = number
  if (position) updates.position = position
  if (Object.keys(updates).length === 0) {
    throw Error('Nothing changed')
  }
  await this.updateOne({ _id }, updates)
  const { __v, ...doc } = player._doc
  return { ...doc, ...updates }
}

// Static delete player method
playerSchema.statics.deletePlayer = async function (_id, user) {
  if (!_id) {
    throw Error('Missing player ID')
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw Error('Invalid player ID')
  }
  const player = await this.findOne({ _id })
  if (!player) {
    throw Error('No player found')
  }
  const allowed = canEdit(player, user.uid, true)
  if (!allowed) {
    throw Error('No access')
  }
  await this.deleteOne({ _id })
  const { __v, ...doc } = player._doc
  return doc
}

// Static update player image method
playerSchema.statics.updatePlayerImage = async function (_id, body, user) {
  if (!_id) {
    throw Error('Missing player ID')
  }
  
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw Error('Invalid player ID')
  }
  const { photoURL } = body
  if (!photoURL) {
    throw { message: 'Please fill in all fields', errorFields: ['photoURL'] }
  }
  const player = await this.findOne({ _id })
  if (!player) {
    throw Error('No player found')
  }
  const allowed = canEdit(player, user.uid)
  if (!allowed) {
    throw Error('No access')
  }
  const photoValid = await isImage(photoURL)
  if (!photoValid) {
    throw { message: 'Invalid photo URL', errorFields: ['photoURL'] }
  }
  await this.updateOne({ _id }, { photoURL })
  const { __v, ...doc } = player._doc
  return { ...doc, photoURL }
}

// Static reset player image method
playerSchema.statics.resetPlayerImage = async function (_id, user) {
  if (!_id) {
    throw Error('Missing player ID')
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw Error('Invalid player ID')
  }
  const player = await this.findOne({ _id })
  if (!player) {
    throw Error('No player found')
  }
  const allowed = canEdit(player, user.uid)
  if (!allowed) {
    throw Error('No access')
  }
  await this.updateOne({ _id }, { photoURL: null })
  const { __v, ...doc } = player._doc
  return { ...doc, photoURL: null }
}

// Static add editor method
playerSchema.statics.addEditor = async function (_id, param, user) {
  if (!_id) {
    throw Error('Missing player ID')
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw Error('Invalid player ID')
  }
  const player = await this.findOne({ _id })
  if (!player) {
    throw Error('No player found')
  }
  if (player.creator.get('teamID')) {
    throw Error('Cannot add editor to player created by team')
  }
  const allowed = canEdit(player, user.uid, true)
  if (!allowed) {
    throw Error('No access')
  }
  if (!param) {
    throw { message: 'Please fill in all fields', errorFields: ['editor'] }
  }
  const editor = await User.findOne({ $or: [{ uid: param }, { email: param }] })
  if (!editor) {
    throw { message: 'No user found', errorFields: ['editor'] }
  }
  if (editor.uid === player.creator.get('uid')) {
    throw { message: 'Cannot add creator to editors', errorFields: ['editor'] }
  }
  if (player.editors.includes(editor.uid)) {
    throw { message: 'User already editor', errorFields: ['editor'] }
  }
  await this.updateOne({ _id }, { editors: [...player._doc.editors, editor.uid] })
  const { __v, ...doc } = player._doc
  return { ...doc, editors: [...doc.editors, editor.uid] }
}

// Static remove editor method
playerSchema.statics.removeEditor = async function (_id, param, user) {
  if (!_id) {
    throw Error('Missing player ID')
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw Error('Invalid player ID')
  }
  const player = await this.findOne({ _id })
  if (!player) {
    throw Error('No player found')
  }
  if (player.creator.get('teamID')) {
    throw Error('Cannot remove editor from player created by team')
  }
  const allowed = canEdit(player, user.uid, true)
  if (!allowed) {
    throw Error('No access')
  }
  if (!param) {
    throw { message: 'Please fill in all fields', errorFields: ['editor'] }
  }
  const editor = await User.findOne({ $or: [{ uid: param }, { email: param }] })
  if (!editor) {
    throw { message: 'No user found', errorFields: ['editor'] }
  }
  if (!player.editors.includes(editor.uid)) {
    throw { message: 'User not editor', errorFields: ['editor'] }
  }
  await this.updateOne({ _id }, { editors: [...player._doc.editors].filter(e => e !== editor.uid) })
  const { __v, ...doc } = player._doc
  return { ...doc, editors: [...player._doc.editors].filter(e => e !== editor.uid) }
}

// Static set privacy method
playerSchema.statics.setPrivacy = async function (_id, body, user) {
  if (!_id) {
    throw Error('Missing player ID')
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw Error('Invalid player ID')
  }
  const { privacy } = body
  if (!privacy) {
    throw { message: 'Please fill in all fields', errorFields: ['privacy'] }
  }
  if (privacy !== 'public' && privacy !== 'private') {
    throw { message: 'Privacy must be set to "public" or "private"', errorFields: ['privacy'] }
  }
  const player = await this.findOne({ _id })
  if (!player) {
    throw Error('No player found')
  }
  const allowed = canEdit(player, user.uid, true)
  if (!allowed) {
    throw Error('No access')
  }
  await this.updateOne({ _id }, { privacy })
  const { __v, ...doc } = player._doc
  return { ...doc, privacy }
}

// Static get player stats method

module.exports = mongoose.model('Player', playerSchema)