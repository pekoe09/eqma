const tokenExtractor = (req, res, next) => {
  console.log('Extracting token...')
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
    console.log('...got token ', req.token)
  } else {
    req.token = null
    console.log('No token found')
  }
  next()
}

module.exports = {
  tokenExtractor
}