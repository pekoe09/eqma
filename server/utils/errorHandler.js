const handleException = (res, exception, entity, operation, status, message) => {
  console.log(`Error with ${operation} ${entity}`)
  console.log(exception)
  if(!message) {
    message = `encountered an error while trying to ${operation} ${entity}`
  }
  res.status(status).json({ error: message })
}

module.exports = { handleException }