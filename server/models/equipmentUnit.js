const mongoose = require('mongoose')

const equipmentUnitSchema = new mongoose.Schema({
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    isRequired: true
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AssetTransaction'
  }],
  registration: String,
  VIN: String,
  assetID: {
    type: String,
    isRequired: true
  }
})

const EquipmentUnit = mongoose.model('EquipmentUnit', equipmentUnitSchema)

module.exports = EquipmentUnit