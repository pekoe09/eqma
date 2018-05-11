const equipmentUnitsRouter = require('express').Router()
const EquipmentUnit = require('../models/equipmentUnit')
const Equipment = require('../models/equipment')
const { handleException } = require('../utils/errorHandler')
const _ = require('lodash')

equipmentUnitsRouter.get('/', async (req, res) => {
  const equipmentUnits = await EquipmentUnit
    .find({})
    .populate({
      path: 'equipment',
      populate: { path: 'equipmentType' }
    })
  res.json(equipmentUnits)
})

equipmentUnitsRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.equipment) {
      return res.status(400).json({ error: 'equipment is missing' })
    }
    if (!body.assetID) {
      return res.status(400).json({ error: 'asset ID is missing' })
    }
    const equipment = await Equipment.findById(body.equipment)
    if (!equipment) {
      return res.status(400).json({ error: 'equipment cannot be found' })
    }

    const equipmentUnit = new EquipmentUnit({
      equipment: body.equipment,
      transactions: [],
      registration: body.registration,
      VIN: body.VIN,
      assetID: body.assetID
    })

    let savedEquipmentUnit = await equipmentUnit.save()
    equipment.equipmentUnits = equipment.equipmentUnits.concat(savedEquipmentUnit._id)
    await Equipment.findByIdAndUpdate(equipment._id, equipment)
    savedEquipmentUnit = await EquipmentUnit
      .findById(savedEquipmentUnit._id)
      .populate({
        path: 'equipment',
        populate: { path: 'equipmentType' }
      })
    res.status(201).json(savedEquipmentUnit)
  } catch (exception) {
    handleException(res, exception, 'equipment unit', 'create', 500, null)
  }
})

equipmentUnitsRouter.put('/:id', async (req, res) => {
  try {
    const match = await EquipmentUnit.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    const body = req.body
    if (!body.equipment) {
      return res.status(400).json({ error: 'equipment make/model is missing' })
    }
    if (!body.assetID) {
      return res.status(400).json({ error: 'asset ID is missing' })
    }
    const equipment = Equipment.findById(body.equipment)
    if (!equipment) {
      return res.status(400).json({ error: 'equipment make/model cannot be found' })
    }

    const equipmentUnit = {
      equipment: body.equipment,
      transactions: match.transactions,
      registration: body.registration,
      VIN: body.VIN,
      assetID: body.assetID
    }
    if (match.equipment !== body.equipment) {
      console.log('Differrent equipment - need to update')
      let oldEquipment = await Equipment.findById(match.equipment)
      if (oldEquipment) {
        console.log('Removing old ref')
        console.log(match._id)
        console.log(oldEquipment.equipmentUnits)
        oldEquipment.equipmentUnits = oldEquipment.equipmentUnits.filter(e => e.toString() !== match._id.toString())
        console.log(oldEquipment.equipmentUnits)
        await Equipment.findByIdAndUpdate(oldEquipment._id, oldEquipment)
      }
      let newEquipment = await Equipment.findById(body.equipment)
      newEquipment.equipmentUnits = newEquipment.equipmentUnits.concat(match._id)
      await Equipment.findByIdAndUpdate(newEquipment._id, newEquipment)
    }

    const updatedEquipmentUnit = await EquipmentUnit
      .findByIdAndUpdate(match._id, equipmentUnit)
      .populate({
        path: 'equipment',
        populate: { path: 'equipmentType' }
      })
    res.json(updatedEquipmentUnit)
  } catch (exception) {
    handleException(res, exception, 'equipment unit', 'update', 500, null)
  }
})

equipmentUnitsRouter.delete('/:id', async (req, res) => {
  try {
    const equipmentUnit = await EquipmentUnit.findById(req.params.id)
    if (!equipmentUnit) {
      return res.status(400).json({ error: 'nonexistent id' })
    }
    let equipment = await Equipment.findById(equipmentUnit.equipment)
    if (equipment) {
      equipment.equipmentUnits = _.remove(equipment.equipmentUnits, equipmentUnit._id)
      await Equipment.findByIdAndUpdate(equipment._id, equipment)
    }
    await EquipmentUnit.findByIdAndRemove(equipmentUnit._id)
    res.status(204).end()
  } catch (exception) {
    handleException(res, exception, 'equipment unit', 'delete', 500, null)
  }
})

module.exports = equipmentUnitsRouter