const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  lastName: String,
  firstName: String,
  status: String
})

userSchema.statics.fullName = (user) => {
  return `${user.firstName} ${user.lastName}`
}

const User = mongoose.model('User', userSchema)

module.exports = User