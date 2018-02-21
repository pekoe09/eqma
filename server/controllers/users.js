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
    // const decodedToken = jwt.verify(request.token, process.env.SECRET)
    // if (!req.token || !decodedToken.id) {
    //   return res.status(401).json({ error: 'token missing or invalid' })
    // }

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