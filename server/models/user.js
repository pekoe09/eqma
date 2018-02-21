const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { 
    type: String,
    required: true,
    unique: true
  },
  passwordHash: { 
    type:String,
    required: true,
    select: false
  },
  lastName: {
    type: String,
    required: true,
    select: true
  },
  firstName: {
    type: String,
    required: true,
    select: true
  },
  status: {
    type: String,
    required: true,
    select: true
  }
})

userSchema.statics.fullName = (user) => {
  return `${user.firstName} ${user.lastName}`
}

const User = mongoose.model('User', userSchema)

module.exports = User