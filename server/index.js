const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const config = require('./utils/config')
const { tokenExtractor } = require('./utils/tokenExtractor')
const mongo = require('./mongo')

const usersRouter = require('./controllers/users')
const equipmentsRouter = require('./controllers/equipments')

app.use(cors())
app.use(bodyParser.json())
app.use(tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/equipment', equipmentsRouter)

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