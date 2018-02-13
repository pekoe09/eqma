const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const config = require('./utils/config')
const mongo = require('./mongo')

const usersRouter = require('./controllers/users')

app.use(cors())
app.use(bodyParser.json())

app.use('/api/users', usersRouter)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongo.close()
})

module.exports = {
  app, server
}