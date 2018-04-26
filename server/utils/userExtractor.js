const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (req, res, next) => {
  console.log('Starting user extraction')
  if (!req.token) {
    req.user = null
    console.log('No user found')
  } else {
    console.log('Extracting from ', req.token)
    const userId = getUserIdFromToken(req.token)
    if (!userId) {
      res.status(401).json({ error: 'token is invalid' })
    }
    console.log('...got id ', userId)
    req.user = await User.findById(userId)
    console.log('User found', req.user)
  }
  next()
}

const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    return decodedToken.userId
  }
  catch (exception) {
    console.log('Token exception ', exception)
    return null
  }
}

module.exports = { userExtractor }