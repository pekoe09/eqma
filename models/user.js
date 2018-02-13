const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: string,
  passwordHash: string,
  lastName: string,
  firstName: string,
  status: string
})

userSchema.statics.fullName = (user) => {
  return `${user.firstName} ${user.lastName}`
}

const User = mongoose.model('User', userSchema)

module.exports = User