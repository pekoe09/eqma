const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const body = req.body
  console.log('Login request with ', req.body)
  const user = await User
    .findOne({ username: body.username})
    .select({ _id: 1, username: 1, passwordHash: 1, lastName: 1, firstName: 1, email: 1, status: 1 })
  console.log('Found user ', user)
  const passwordCorrect = user === null 
    ? false 
    : await bcrypt.compare(body.password, user.passwordHash)  
  if(!(user && passwordCorrect)) {
    return res.status(401).send({error: 'invalid username or password'})
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }
  console.log('Creating token')
  const token = jwt.sign(userForToken, process.env.SECRET)
  console.log('Sending response ', token, user)
  res.status(200).send({
    username: user.username,
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
    status: user.status,
    token
  })
})

module.exports = loginRouter