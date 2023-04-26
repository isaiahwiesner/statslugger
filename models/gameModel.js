const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Schema
const gameSchema = new Schema({
  homeTeam: {
    type: Map,
    required: true,
  },
  awayTeam: {
    type: Map,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    default: null,
  },
}, { timestamps: true })

// Static add game method
// Static get game method
// Static update game method
// Static delete game method

module.exports = mongoose.model('Game', gameSchema)