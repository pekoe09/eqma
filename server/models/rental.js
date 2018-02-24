const mongoose = require('mongoose')

const rentalSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    isRequired: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    isRequired: true
  },
  start: {
    type: Date,
    isRequired: true
  },
  end: Date,
  timeUnit: {
    type: String,
    isRequired: true
  },
  price: {
    type: Number,
    isRequired: true
  }
})

const Rental = mongoose.model('Rental', rentalSchema)

module.exports = Rental