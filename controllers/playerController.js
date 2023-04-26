const Player = require('../models/playerModel')

// Add player
const addPlayer = async (req, res) => {
  try {
    const player = await Player.addPlayer(req.body, req.user)
    res.status(200).json({ msg: 'Player created', player })
  } catch (e) {
    const json = { error: e.message }
    if (e.errorFields) json.errorFields = e.errorFields
    res.status(400).json(json)
  }
}

// Get player
const getPlayer = async (req, res) => {
  const { _id } = req.params
  try {
    const player = await Player.getPlayer(_id)
    res.status(200).json(player)
  } catch (e) {
    const json = { error: e.message }
    if (e.errorFields) json.errorFields = e.errorFields
    res.status(400).json(json)
  }
}

// Update player
const updatePlayer = async (req, res) => {
  const { _id } = req.params
  try {
    const player = await Player.updatePlayer(_id, req.body, req.user)
    res.status(200).json({ msg: 'Player updated', player })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}

// Delete player
const deletePlayer = async (req, res) => {
  const { _id } = req.params
  try {
    const player = await Player.deletePlayer(_id, req.user)
    res.status(200).json({ msg: 'Player deleted', player })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}

// Update player image
const updatePlayerImage = async (req, res) => {
  const { _id } = req.params
  try {
    const player = await Player.updatePlayerImage(_id, req.body, req.user)
    res.status(200).json({ msg: 'Player image updated', player })
  } catch (e) {
    const json = { error: e.message }
    if (e.errorFields) json.errorFields = e.errorFields
    res.status(400).json(json)
  }
}

// Update player image
const resetPlayerImage = async (req, res) => {
  const { _id } = req.params
  try {
    const player = await Player.resetPlayerImage(_id, req.user)
    res.status(200).json({ msg: 'Player image reset', player })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}

// Add editor
const addEditor = async (req, res) => {
  const { _id } = req.params
  const { editor } = req.body
  try {
    const player = await Player.addEditor(_id, editor, req.user)
    res.status(200).json({ msg: 'Editor added', player })
  } catch (e) {
    const json = { error: e.message }
    if (e.errorFields) json.errorFields = e.errorFields
    res.status(400).json(json)
  }
}

// Remove editor
const removeEditor = async (req, res) => {
  const { _id } = req.params
  const { editor } = req.body
  try {
    const player = await Player.removeEditor(_id, editor, req.user)
    res.status(200).json({ msg: 'Editor removed', player })
  } catch (e) {
    const json = { error: e.message }
    if (e.errorFields) json.errorFields = e.errorFields
    res.status(400).json(json)
  }
}

// Set privacy
const setPrivacy = async (req, res) => {
  const { _id } = req.params
  try {
    const player = await Player.setPrivacy(_id, req.body, req.user)
    res.status(200).json({ msg: 'Privacy updated', player })
  } catch (e) {
    const json = { error: e.message }
    if (e.errorFields) json.errorFields = e.errorFields
    res.status(400).json(json)
  }
}

// Get player stats

module.exports = {
  addPlayer,
  getPlayer,
  updatePlayer,
  deletePlayer,
  updatePlayerImage,
  resetPlayerImage,
  addEditor,
  removeEditor,
  setPrivacy,
  // getPlayerStats,
}