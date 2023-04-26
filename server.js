require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')
const playersRouter = require('./routers/playersRouter')

// Setup express
const app = express()

// Middleware
app.use(bodyParser.json())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
  credentials: true
}))

// Routers
app.use('/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/players', playersRouter)

// Connect to mongo and start
const port = process.env.PORT || 5000
const connect = async () => {
  await mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => {
      console.log('Connected to MongoDB and listening on port ' + port)
    })
  })
  .catch((e) => {
    console.error(e)
  })
}
connect()