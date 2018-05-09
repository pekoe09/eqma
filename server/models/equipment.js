const mongoose = require('mongoose')

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    isRequired: true
  },
  equipmentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentType'
  },
  make: String,
  model: String,
  description: String,
  features: [{
    key: String,
    value: String
  }],
  price: Number,
  timeUnit: String,
  equipmentUnits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentUnit'
  }]
})

equipmentSchema.virtual('makeAndModel').get(function () {
  return (`${this.make} ${this.model}`).trim()
})

equipmentSchema.set('toObject', { virtuals: true })
equipmentSchema.set('toJSON', { virtuals: true })

const Equipment = mongoose.model('Equipment', equipmentSchema)

module.exports = Equipment