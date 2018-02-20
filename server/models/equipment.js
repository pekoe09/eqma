const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema({
  name: { type: String, isRequired: true },
  make: String,
  model: String,
  description: String,
  features: [{
    key: String,
    value: String
  }],
  price: Number,
  timeUnit: String
})

const Equipment = mongoose.model('Equipment', equipmentSchema)

module.exports = Equipment