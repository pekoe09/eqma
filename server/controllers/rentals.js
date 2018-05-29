const rentalsRouter = require('express').Router()
const { handleException } = require('../utils/errorHandler')
const { validateMandatoryFields } = require('../utils/validator')
const Rental = require('../models/rental')
const Customer = require('../models/customer')
const { findAvailableUnits } = require('./equipmentUnits')

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

rentalsRouter.get('/mine', async (req, res) => {
  try {
    if (!req.user) {
      handleException(res, null, 'rental', 'reserver', 403, 'Customer is not logged in')
    } else {
      const customer = await Customer.find({ userID: req.user._id })
      console.log('found customer for my rentals', customer)
      let rentals = await Rental
        .find({ customer: customer })
        .populate({
          path: 'equipmentUnit customer',
          populate: {
            path: 'equipment'
          }
        })
      console.log('found rentals for me', rentals)
      rentals = rentals.map(r => Rental.format(r._doc))
      res.json(rentals)
    }
  } catch (exception) {
    handleException(res, exception, 'rental', 'get_mine', 500)
  }
})

rentalsRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    const mandatories = ['equipmentUnit', 'customer', 'start', 'end', 'timeUnit', 'price']
    validateMandatoryFields(req, res, mandatories, 'rental', 'confirm')

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
    res.status(201).json(populatedRental)
  } catch (exception) {
    handleException(res, exception, 'rental', 'create', 500)
  }
})

rentalsRouter.post('/reserve', async (req, res) => {
  try {
    if (!req.user) {
      handleException(res, null, 'rental', 'reserver', 403, 'Customer is not logged in')
    }

    const body = req.body
    const mandatories = []
    validateMandatoryFields(req, res, mandatories, 'rental', 'reserve')

    console.log('trying to find units', body.start, body.end, body.equipment)
    const availableUnits = await findAvailableUnits(body.start, body.end, body.equipment)
    console.log('found units', availableUnits)
    if (availableUnits.length === 0) {
      console.log('no units found')
      handleException(res, null, 'rental', 'reserve', 400, 'No units available for period in question')
    } else {
      console.log('looking for customer based on user ' + req.user._id)
      let customer = null
      customer = await Customer.findOne({ userID: req.user._id })
      if (!customer) {
        handleException(res, null, 'rental', 'reserve', 400, 'No customer found')
      } else {
        console.log('found', customer)
        console.log('reserving ' + availableUnits[0])

        const rental = new Rental({
          equipmentUnit: availableUnits[0],
          customer: customer,
          start: body.start,
          end: body.end,
          timeUnit: body.timeUnit,
          price: body.price,
          isReservation: true
        })
        console.log('saving reservation', rental)
        const savedRental = await rental.save()
        const populatedRental = await Rental
          .findById(savedRental._id)
          .populate({
            path: 'customer equipmentUnit',
            populate: {
              path: 'equipment'
            }
          })
        res.status(201).json(populatedRental)
      }
    }
  } catch (exception) {
    handleException(res, exception, 'rental', 'reserve', 500)
  }
})

rentalsRouter.post('/confirm/:id', async (req, res) => {
  console.log('confirming rental')
  try {
    const match = await Rental.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    match.isReservation = false
    const updatedRental = await Rental
      .findByIdAndUpdate(req.params.id, match, { new: true })
      .populate({
        path: 'customer equipmentUnit',
        populate: {
          path: 'equipment'
        }
      })
    console.log('confirned rental', updatedRental)
    res.json(updatedRental)
  } catch (exception) {
    handleException(res, exception, 'rental', 'confirm', 500)
  }
})

rentalsRouter.put('/:id', async (req, res) => {
  try {
    const match = await Rental.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    const body = req.body
    const mandatories = ['equipmentUnit', 'customer', 'start', 'end', 'timeUnit', 'price']
    validateMandatoryFields(req, res, mandatories, 'rental', 'confirm')

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
    handleException(res, exception, 'rental', 'update', 500)
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