const validateMandatoryField = (req, res, fieldName, entity, operation, message) => {
  const fieldParts = fieldName.split('.')
  let fieldFound = false
  if (fieldParts.length === 1) {
    fieldFound = req.body[fieldName]
  } else if (fieldParts.length === 2) {
    fieldFound = req.body[fieldParts[0]][fieldParts[1]]
  }
  if (!fieldFound) {
    if (!message) {
      message = `${fieldName} is missing`
    }
    console.log(`validation error while trying to ${operation} ${entity}`)
    console.log(message)
    res.status(400).json({ error: message })
  }
}
const validateMandatoryFields = (req, res, fieldNames, entity, operation, message) => {
  fieldNames.forEach(f => validateMandatoryField(req, res, f, entity, operation, message))
}


module.exports = { validateMandatoryFields }