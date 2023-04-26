const mongoose = require('mongoose')

const Schema = mongoose.Schema

// Schema
const statEntrySchema = new Schema({
  player: {
    type: String,
    default: null,
  },
  game: {
    type: String,
    default: null,
  },
  stats: {
    type: Map,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
}, { timestamps: true })

// Static add entry method
// Static get entry method
// Static update entry method
// Static delete entry method

module.exports = mongoose.model('Stats', statEntrySchema)