const mongoose = require('mongoose')

const equipmentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    isRequired: true
  },
  parentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentType'
  },
  childTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentType'
  }],
  equipment: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment'
  }]
})

const EquipmentType = mongoose.model('EquipmentType', equipmentTypeSchema)

module.exports = EquipmentType