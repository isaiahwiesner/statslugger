const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Schema
const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: null,
  },
  photoURL: {
    type: String,
    default: null,
  },
  staff: {
    type: Array,
    default: []
  },
  players: {
    type: Array,
    default: []
  },
  fans: {
    type: Array,
    default: []
  },
  privacy: {
    type: String,
    default: 'public',
  },
}, { timestamps: true })

// Static add team method
// Static get team method
// Static update team method
// Static delete team method
// Static update team image method
// Static reset team image method
// Static get team stats method
// Static get team schedule method
// Static add staff method
// Static remove staff method
// Static add player method
// Static remove player method
// Static add fan method
// Static remove fan method
// Static set privacy method

module.exports = mongoose.model('Team', teamSchema)