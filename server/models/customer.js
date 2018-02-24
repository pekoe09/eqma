const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
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

customerSchema.statics.displayName = (customer) => 
  company ? company : `${lastName}, ${firstNames}`

const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer