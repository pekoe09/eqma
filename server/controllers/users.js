const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const moment = require('moment')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Session = require('../models/session')

usersRouter.get('/', async (req, res) => {
  let users = await User.find({})
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
      email: body.email,
      status: body.status === undefined ? 'user' : body.status
    })

    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'encountered an error while trying to save a user' })
  }
})

usersRouter.post('/login', async (req, res) => {
  const body = req.body
  const user = await User
    .findOne({ username: body.username })
    .select({ _id: 1, username: 1, passwordHash: 1, lastName: 1, firstName: 1, email: 1, status: 1 })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)
  if (!(user && passwordCorrect)) {
    return res.status(401).send({ error: 'invalid username or password' })
  }

  const tokenPayload = {
    username: user.username,
    userId: user._id,
    userStatus: user.status,
    exp: moment().add(1, 'h') / 1000
  }
  const token = jwt.sign(tokenPayload, process.env.SECRET)

  const session = new Session({
    user,
    start: moment(),
    issuedToken: token,
    expiry: tokenPayload.exp * 1000
  })
  const savedSession = await session.save()

  res.status(200).send({
    username: user.username,
    lastName: user.lastName,
    firstName: user.firstName,
    email: user.email,
    status: user.status,
    token
  })
})

usersRouter.post('/logout', async (req, res) => {
  try {
    const session = Session.findOne({ issuedToken: req.token })
    if (!session) {
      return res.status(401).json({ error: 'session to logout from is not found' })
    }
    session.end = moment()
    await Session.findByIdAndUpdate(session._id, session)

    res.status(204).end()
  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'encountered an error while logging out' })
  }
})

usersRouter.put('/:id', async (req, res) => {
  try {
    const match = await User.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    const body = req.body
    if (!body.username) {
      return res.status(400).json({ error: 'username is missing' })
    }
    const nameMatch = await User.find({ username: body.username })
    let foundName = false
    nameMatch.forEach(nm => {
      if (nm._id.toString() !== req.params.id.toString()) {
        foundName = true
      }
    })
    if (foundName) {
      return res.status(400).json({ error: 'username is already in use' })
    }

    const user = {
      username: body.username,
      passwordHash: match.passwordHash,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      status: body.status === undefined ? 'user' : body.status
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true })
    res.json(updatedUser)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({ error: 'encountered an error while trying to update a user' })
  }
})

usersRouter.delete('/:id', async (req, res) => {
  try {
    console.log('comparing ' + req.params.id + " and " + req.user._id)
    console.log('result is ' + (req.params.id === req.user._id))
    if(req.params.id == req.user._id) {
      return res.status(403).json({ error: 'user cannot delete self' })
    }
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(400).json({ error: 'nonexistent id' })
    }
    await User.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (exception) {
    if (exception.name === 'JsonWebTokenError') {
      res.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      res.status(500).json({ error: 'encountered an error while trying to delete a user' })
    }
  }
})

module.exports = usersRouter