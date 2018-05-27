const equipmentRouter = require('express').Router()
const Equipment = require('../models/equipment')
const EquipmentType = require('../models/equipmentType')
const { handleException } = require('../utils/errorHandler')
const _ = require('lodash')

equipmentRouter.get('/', async (req, res) => {
  const equipments = await Equipment
    .find({})
    .populate('equipmentType')
  res.json(equipments)
})

equipmentRouter.get('/forrent', async (req, res) => {
  const equipments = await Equipment
    .find({})
    .populate('equipmentType')
  res.json(equipments)
})

equipmentRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.equipmentType) {
      return res.status(400).json({ error: 'equipment type is missing' })
    }
    const equipmentType = await EquipmentType.findById(body.equipmentType)
    if (!equipmentType) {
      return res.status(400).json({ error: 'equipment type cannot be found' })
    }

    const equipment = new Equipment({
      equipmentType: body.equipmentType,
      make: body.make,
      model: body.model,
      description: body.description,
      features: body.features,
      price: body.price ? Number(body.price) : null,
      timeUnit: body.timeUnit,
      equipmentUnits: []
    })
    let savedEquipment = await equipment.save()
    equipmentType.equipment = equipmentType.equipment.concat(savedEquipment._id)
    await EquipmentType.findByIdAndUpdate(equipmentType._id, equipmentType)
    savedEquipment = await Equipment
      .findById(savedEquipment._id)
      .populate('equipmentType')
    res.status(201).json(savedEquipment)
  } catch (exception) {
    handleException(res, exception, 'equipment', 'create', 500, null)
  }
})

equipmentRouter.put('/:id', async (req, res) => {
  try {
    const match = await Equipment.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    const body = req.body
    if (!body.equipmentType) {
      return res.status(400).json({ error: 'equipment type is missing' })
    }
    const equipmentType = EquipmentType.findById(body.equipmentType)
    if (!equipmentType) {
      return res.status(400).json({ error: 'equipment type cannot be found' })
    }

    const equipment = {
      equipmentType: body.equipmentType,
      make: body.make,
      model: body.model,
      description: body.description,
      features: body.features,
      price: body.price ? Number(body.price) : null,
      timeUnit: body.timeUnit,
      equipmentUnits: match.equipmentUnits
    }
    if (match.equipmentType !== body.equipmentType) {
      let oldType = await EquipmentType.findById(match.equipmentType)
      if (oldType) {
        oldType.equipment = oldType.equipment.filter(e => e.toString() !== match._id.toString())
        await EquipmentType.findByIdAndUpdate(oldType._id, oldType)
      }
      let newType = await EquipmentType.findById(body.equipmentType)
      newType.equipment = newType.equipment.concat(match._id)
      await EquipmentType.findByIdAndUpdate(newType._id, newType)
    }

    const updatedEquipment = await Equipment
      .findByIdAndUpdate(req.params.id, equipment, { new: true })
      .populate('equipmentType')
    res.json(updatedEquipment)
  } catch (exception) {
    handleException(res, exception, 'equipment', 'update', 500, null)
  }
})

equipmentRouter.delete('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
    if (!equipment) {
      return res.status(400).json({ error: 'nonexistent id' })
    }
    let equipmentType = await EquipmentType.findById(equipment.equipmentType)
    if(equipmentType) {
      equipmentType.equipment = _.remove(equipmentType.equipment, equipment._id)
      await EquipmentType.findByIdAndUpdate(equipmentType._id, equipmentType)
    }
    await Equipment.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (exception) {
    handleException(res, exception, 'equipment', 'delete', 500, null)
  }
})

module.exports = equipmentRouter