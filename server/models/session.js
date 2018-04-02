const mongoose = require('mongoose')
const moment = require('moment')

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    isRequired: true
  },
  start: {
    type: Date,
    isRequired: true
  },
  end: Date,
  expiry: Date,
  issuedToken: {
    type: String,
    isRequired: true
  }
})

const Session = mongoose.model('Session', sessionSchema)

module.exports = Session