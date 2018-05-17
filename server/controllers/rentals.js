const rentalsRouter = require('express').Router()
const Rental = require('../models/rental')

rentalsRouter.get('/', async (req, res) => {
  let rentals = await Rental
    .find({})
    .populate({
      path: 'equipmentUnit customer',
      populate: {
        path: 'equipment'
      }
    })
  rentals = rentals.map(r => Rental.format(r._doc))
  res.json(rentals)
})

rentalsRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    console.log('Renting ', req.body)
    if (!body.equipmentUnit) {
      return res.status(400).json({ error: 'equipment unit is missing' })
    }
    if (!body.customer) {
      return res.status(400).json({ error: 'customer is missing' })
    }
    if (!body.start) {
      return res.status(400).json({ error: 'start time is missing' })
    }
    if (body.end && body.start > body.end) {
      return res.status(400).json({ error: 'end time is before start time' })
    }
    if (!body.timeUnit) {
      return res.status(400).json({ error: 'time unit is missing' })
    }
    if (!body.price) {
      return res.status(400).json({ error: 'price is missing' })
    }

    const rental = new Rental({
      equipmentUnit: body.equipmentUnit,
      customer: body.customer,
      start: body.start,
      end: body.end,
      timeUnit: body.timeUnit,
      price: body.price
    })
    const savedRental = await rental.save()
    const populatedRental = await Rental
      .findById(savedRental._id)
      .populate({
        path: 'customer equipmentUnit',
        populate: {
          path: 'equipment'
        }
      })
    console.log('Returning ', populatedRental)
    res.status(201).json(populatedRental)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to create a rental'
    })
  }
})

rentalsRouter.put('/:id', async (req, res) => {
  try {
    const match = await Rental.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    const body = req.body
    if (!body.equipmentUnit) {
      return res.status(400).json({ error: 'equipment unit is missing' })
    }
    if (!body.customer) {
      return res.status(400).json({ error: 'customer is missing' })
    }
    if (!body.start) {
      return res.status(400).json({ error: 'start time is missing' })
    }
    if (body.end && body.start > body.end) {
      return res.status(400).json({ error: 'end time is before start time' })
    }
    if (!body.timeUnit) {
      return res.status(400).json({ error: 'time unit is missing' })
    }
    if (!body.price) {
      return res.status(400).json({ error: 'price is missing' })
    }

    const rental = {
      equipmentUnit: body.equipmentUnit,
      customer: body.customer,
      start: body.start,
      end: body.end,
      timeUnit: body.timeUnit,
      price: body.price
    }
    const updatedRental = await Rental.findByIdAndUpdate(
      req.params.id, rental, { new: true })
    res.json(updatedRental)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to update a rental'
    })
  }
})

rentalsRouter.delete('/:id', async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
    if (!rental) {
      return res.status(400).json({ error: 'nonexistent id' })
    }
    await Rental.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to delete an equipment'
    })
  }
})

module.exports = rentalsRouter