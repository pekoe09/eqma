const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastName: String,
  firstNames: String,
  company: String,
  email: String,
  phone: String,
  billingAddress: {
    street1: String,
    street2: String,
    zip: String,
    city: String,
    country: String
  },
  isInvoicable: Boolean
})

customerSchema.virtual('displayName').get(function () {
  return this.company ? this.company : `${this.lastName}, ${this.firstNames}`
}
)

customerSchema.set('toObject', { virtuals: true })
customerSchema.set('toJSON', { virtuals: true })

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer