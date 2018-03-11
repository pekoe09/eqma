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
  timeUnit: String,
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetTransaction'
  }]
})

equipmentSchema.virtual('makeAndModel').get(function () {
  return (`${this.make} ${this.model}`).trim()
})

equipmentSchema.set('toObject', { virtuals: true })
equipmentSchema.set('toJSON', { virtuals: true })

const Equipment = mongoose.model('Equipment', equipmentSchema)

module.exports = Equipment