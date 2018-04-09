const mongoose = require('mongoose')

const customerMessageSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  email: {
    type: String,
    isRequired: true
  },
  name: {
    type: String,
    isRequired: true
  },
  message: String,
  sent: {
    type: Date,
    isRequired: true
  },
  handler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reply: String,
  replySent: Date
})

const CustomerMessage = mongoose.model('CustomerMessage', customerMessageSchema)

module.exports = CustomerMessage