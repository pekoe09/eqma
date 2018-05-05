const equipmentRouter = require('express').Router()
const Equipment = require('../models/equipment')

equipmentRouter.get('/', async (req, res) => {
  const equipments = await Equipment.find({})
  res.json(equipments)
})

equipmentRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.name) {
      return res.status(400).json({ error: 'name is missing' })
    }

    const equipment = new Equipment({
      name: body.name,
      make: body.make,
      model: body.model,
      description: body.description,
      features: body.features,
      price: body.price ? Number(body.price) : null,
      timeUnit: body.timeUnit
    })
    const savedEquipment = await equipment.save()
    res.status(201).json(savedEquipment)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to create an equipment'
    })
  }
})

equipmentRouter.put('/:id', async (req, res) => {
  try {
    const match = await Equipment.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    const body = req.body
    if (!body.name) {
      return res.status(400).json({ error: 'name is missing' })
    }

    const equipment = {
      name: body.name,
      make: body.make,
      model: body.model,
      description: body.description,
      features: body.features,
      price: body.price ? Number(body.price) : null,
      timeUnit: body.timeUnit
    }
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      req.params.id, equipment, { new: true })
    res.json(updatedEquipment)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to update an equipment'
    })
  }
})

equipmentRouter.delete('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id)
    if (!equipment) {
      return res.status(400).json({ error: 'nonexistent id' })
    }
    await Equipment.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to delete an equipment'
    })
  }
})

module.exports = equipmentRouter