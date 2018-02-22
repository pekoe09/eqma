const equipmentRouter = require('express').Router()
//const jwt = require('jsonwebtoken')
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
    console.log('Requesting ', req.params.id)
    const match = await Equipment.findById(req.params.id)
    console.log('Matched ', match)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    const body = req.body
    console.log('Name ', req.body.name)
    if (!body.name) {
      console.log('Name not accepted')
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
    // const decodedToken = jwt.verify(req.token, process.env.SECRET)
    // if (!req.token || !decodedToken.id) {
    //   return res.status(401).json({ error: 'token missing or invalid' })
    // }
    const equipment = await Equipment.findById(req.params.id)
    if (!equipment) {
      return res.status(400).json({ error: 'nonexistent id' })
    }
    await Equipment.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (exception) {
    console.log(exception)
    if (exception.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'token is rejected' })
    } else {
      res.status(500).json({
        error: 'encountered an error while trying to delete an equipment'
      })
    }
  }
})

module.exports = equipmentRouter