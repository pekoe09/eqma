const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.username) {
      return res.status(400).json({ error: 'username is missing' })
    }
    const match = await User.find({ username: body.username })
    if (match.length > 0) {
      return res.status(400).json({ error: 'username is already in use' })
    }
    if (!body.password) {
      return res.status(400).json({ error: 'password is missing' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      passwordHash,
      firstName: body.firstName,
      lastName: body.lastName,
      status: body.status === undefined ? 'user' : body.status
    })

    const savedUser = await user.save()

    res.status(201).json(savedUser)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'encountered an error while trying to save a user' })
  }
})

module.exports = usersRouter