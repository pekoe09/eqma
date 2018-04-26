const jwt = require('jsonwebtoken')

getUserIdFromToken = function (request, response) {
  try {
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.userId) {
      console.log('Failed token')
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    return decodedToken.userId
  } catch (exception) {
    console.log('Token exception:', exception)
    response.status(401).send({ error: 'token missing or invalid' })
  }
}


const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

module.exports = { getTokenFrom }