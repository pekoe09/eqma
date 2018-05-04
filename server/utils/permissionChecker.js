const permissionChecker = (usertypes, freepaths) => {
  return async function (req, res, next) {
    // console.log('Checking permissions...')
    // console.log(usertypes, freepaths, req.url)
    if (freepaths.includes(req.url)) {
      // console.log('OK, just a free path:', req.url)
    } else if (freepaths.includes(`${req.method}:${req.url}`)) {
      // console.log('OK, just a free path:', req.url)
    } else if (!req.user) {
      return res.status(403).json({ error: 'no user information' })
    } else if (!req.user.status || !usertypes.includes(req.user.status)) {
      // console.log('fail: user info found', req.user)
      return res.status(403).json({ error: 'insufficient permissions' })
    } else {
      // console.log('success: user info found', req.user)
    }
    next()
  }
}

module.exports = { permissionChecker }