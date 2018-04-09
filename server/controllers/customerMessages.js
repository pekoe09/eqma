const customerMessagesRouter = require('express').Router()
const CustomerMessage = require('../models/customerMessage')
const moment = require('moment')

customerMessagesRouter.get('/', async (req, res) => {
  let messages = await CustomerMessage
    .find({})
    .populate('customer handler')
  res.json(messages)
})

customerMessagesRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.name) {
      return res.status(400).json({ error: 'name is missing' })
    }
    if (!body.email) {
      return res.status(400).json({ error: 'email is missing' })
    }

    const message = new CustomerMessage({
      customer: body.customerId,
      name: body.name,
      email: body.email,
      message: body.message,
      sent: moment()
    })
    console.log('Saving ', message)
    const savedMessage = await message.save()
    res.status(201).json(savedMessage)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to create a customer message'
    })
  }
})

customerMessagesRouter.put('/:id', async (req, res) => {
  // only possible fields to update: handler and reply (with replySent)
  console.log('Received req ', req.body)
  try {
    const match = await CustomerMessage.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }
    console.log('Matched with ', match)

    const body = req.body
    const message = match
    if(body.handler) {
      message.handler = body.handler
    }
    if(body.reply) {
      message.reply = body.reply
      message.replySent = moment()
    }
    console.log('Persisting ', message)
    const updatedMessage = await CustomerMessage.findByIdAndUpdate(
      req.params.id, message, { new: true })
    res.json(updatedMessage)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to update a customer message'
    })
  }
})

customerMessagesRouter.delete('/:id', async (req, res) => {
  try {
    const message = await CustomerMessage.findById(req.params.id)
    if (!message) {
      return res.status(400).json({ error: 'nonexistent id' })
    }
    await CustomerMessage.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to delete a customer message'
    })
  }
})

module.exports = customerMessagesRouter