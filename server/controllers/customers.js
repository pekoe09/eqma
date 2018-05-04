const customerRouter = require('express').Router()
const Customer = require('../models/customer')

customerRouter.get('/', async (req, res) => {
  const customers = await Customer.find({})
  res.json(customers)
})

customerRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.lastName && !body.company) {
      return res.status(400).json({
        error: 'either company or last name must be provided'
      })
    }

    const customer = new Customer({
      lastName: body.lastName,
      firstNames: body.firstNames,
      company: body.company,
      billingAddress: {
        street1: body.billingAddress.street1,
        street2: body.billingAddress.street2,
        zip: body.billingAddress.zip,
        city: body.billingAddress.city,
        country: body.billingAddress.country
      }
    })
    const savedCustomer = await customer.save()
    res.status(201).json(savedCustomer)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to create a customer'
    })
  }
})

customerRouter.put('/:id', async (req, res) => {
  try {
    const match = await Customer.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    const body = req.body
    if (!body.company && !body.lastName) {
      return res.status(400).json({
        error: 'either company or last name must be provided'
      })
    }

    const customer = {
      lastName: body.lastName,
      firstNames: body.firstNames,
      company: body.company,
      email: body.email,
      phone: body.phone,
      isInvoicable: body.isInvoicable,
      billingAddress: body.billingAddress
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id, customer, { new: true })

    res.json(updatedCustomer)
  } catch (exception) {
    res.status(500).json({
      error: 'encountered an error while trying to update a customer' + exception.message
    })
  }
})

customerRouter.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    if (!customer) {
      return res.status(400).json({ error: 'nonexistent id' })
    }
    await Customer.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (exception) {
    res.status(500).json({
      error: 'encountered an error while trying to delete a customer'
    })
  }
})

module.exports = customerRouter