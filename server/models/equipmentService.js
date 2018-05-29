const mongoose = require('mongoose')
const moment = require('moment')

const equipmentServiceSchema = new mongoose.Schema({
  equipmentUnit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EquipmentUnit',
    isRequired: true
  },
  scheduledStartDate: Date,
  scheduledEndDate: Date,
  startDate: Date,
  endDate: Date,
  estimatedCost: Number,
  cost: Number,
  description: String
})

equipmentServiceSchema.virtual('scheduledDuration').get(function () {
  if (this.scheduledStartDate && this.scheduledEndDate) {
    return moment(scheduledEndDate).diff(moment(scheduledStartDate))
  } else {
    return null
  }
})

equipmentServiceSchema.virtual('duration').get(function () {
  if (this.startDate && this.endDate) {
    return moment(endDate).diff(moment(startDate))
  } else {
    return null
  }
})

equipmentServiceSchema.virtual('costEstimateError').get(function () {
  if (this.estimatedCost && this.cost) {
    return cost - estimatedCost
  } else {
    return null
  }
})

equipmentSchema.set('toObject', { virtuals: true })
equipmentSchema.set('toJSON', { virtuals: true })

const EquipmentService = mongoose.model('EquipmentService', equipmentServiceSchema)

module.exports = EquipmentService