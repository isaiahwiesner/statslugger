const express = require('express')
const requireAuth = require('../middleware/requireAuth')
const {
  addPlayer,
  getPlayers,
  getPlayer,
  updatePlayer,
  deletePlayer,
  updatePlayerImage,
  resetPlayerImage,
  addEditor,
  removeEditor,
  setPrivacy,
  // getPlayerStats,
} = require('../controllers/playerController')

const playersRouter = express.Router()

// Add player
playersRouter.post('/', requireAuth, addPlayer)

// Get players
playersRouter.get('/', requireAuth, getPlayers)

// Get player
playersRouter.get('/:_id', getPlayer)

// Update player
playersRouter.patch('/:_id', requireAuth, updatePlayer)

// Delete player
playersRouter.delete('/:_id', requireAuth, deletePlayer)

// Update player image
playersRouter.patch('/:_id/image', requireAuth, updatePlayerImage)

// Update player image
playersRouter.delete('/:_id/image', requireAuth, resetPlayerImage)

// Get player stats

// Add editor
playersRouter.post('/:_id/editors', requireAuth, addEditor)

// Remove editor
playersRouter.delete('/:_id/editors', requireAuth, removeEditor)

// Set privacy
playersRouter.patch('/:_id/privacy', requireAuth, setPrivacy)

// Get stats

module.exports = playersRouter