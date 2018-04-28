const permissionChecker = (...usertypes) => {
  return async function (req, res, next) {
    console.log('Checking permissions...')
    if (!req.user) {
      return res.status(403).json({ error: 'no user information' })
    } else if (!req.user.status || !usertypes.includes(req.user.status)) {
      console.log('fail: user info found', req.user)
      return res.status(403).json({ error: 'insufficient permissions' })
    } else {
      console.log('success: user info found', req.user)
    }
    next()
  }
}

module.exports = { permissionChecker }