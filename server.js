require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const authRouter = require('./routers/authRouter')
const userRouter = require('./routers/userRouter')

// Setup express
const app = express()

// Middleware
app.use(bodyParser.json())
const allowedOrigins = ['https://statslugger.web.app']
app.use(cors({
  origin: allowedOrigins
}))

// Routers
app.use('/auth', authRouter)
app.use('/api/user', userRouter)

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