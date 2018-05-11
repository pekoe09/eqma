const assetTransactionRouter = require('express').Router()
const AssetTransaction = require('../models/assetTransaction')
const EquipmentUnit = require('../models/equipmentUnit')

assetTransactionRouter.get('/', async (req, res) => {
  const assetTransactions = await AssetTransaction
    .find({})
    .populate('equipmentUnit')
  res.json(assetTransactions)
})

assetTransactionRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.equipmentUnit) {
      return res.status(400).json({ error: 'equipment unit is missing' })
    }
    const equipmentUnit = await EquipmentUnit.findById(body.equipmentUnit)
    if (!equipmentUnit) {
      return res.status(400).json({ error: 'invalid equipment unit id' })
    }
    if (!body.date) {
      return res.status(400).json({ error: 'date is missing' })
    }
    if (!body.type) {
      return res.status(400).json({ error: 'type is missing' })
    }
    if (!body.value) {
      return res.status(400).json({ error: 'value is missing' })
    }
    if (!body.description) {
      return res.status(400).json({ error: 'description is missing' })
    }

    const assetTransaction = new AssetTransaction({
      equipmentUnit: body.equipmentUnit,
      date: body.date,
      type: body.type,
      value: body.value,
      description: body.description,
      isDeleted: false
    })

    const savedTransaction = await assetTransaction.save()
    const populatedTransaction = await AssetTransaction
      .findById(savedTransaction._id)
      .populate('equipmentUnit')
    if (!equipmentUnit.transactions) {
      equipmentUnit.transactions = []
    }
    equipmentUnit.transactions = equipmentUnit.transactions.concat(savedTransaction._id)
    await EquipmentUnit.findByIdAndUpdate(equipmentUnit._id, equipmentUnit)

    res.status(201).json(populatedTransaction)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to create an asset transaction'
    })
  }
})

assetTransactionRouter.put('/:id', async (req, res) => {
  try {
    const match = await AssetTransaction.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    const body = req.body
    if (!body.equipmentUnit) {
      return res.status(400).json({ error: 'equipment unit is missing' })
    }
    const equipmentUnit = EquipmentUnit.findById(body.equipmentUnit)
    if (!equipmentUnit) {
      return res.status(400).json({ error: 'invalid equipment unit id' })
    }
    if (!body.date) {
      return res.status(400).json({ error: 'date is missing' })
    }
    if (!body.type) {
      return res.status(400).json({ error: 'type is missing' })
    }
    if (!body.value) {
      return res.status(400).json({ error: 'value is missing' })
    }
    if (!body.description) {
      return res.status(400).json({ error: 'description is missing' })
    }

    const assetTransaction = new AssetTransaction({
      equipmentUnit: body.equipmentUnit,
      date: body.date,
      type: body.type,
      value: body.value,
      description: body.description,
      isDeleted: false,
      predecessor: match._id
    })
    const savedTransaction = await assetTransaction.save()

    match.successor = savedTransaction._id
    match.isDeleted = true
    await AssetTransaction.findByIdAndUpdate(match.id, match, { new: true })

    res.json(savedTransaction)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to update an asset transaction'
    })
  }
})

assetTransactionRouter.delete('/:id', async (req, res) => {
  try {
    const assetTransaction = await AssetTransaction.findById(req.params.id)
    if (!assetTransaction) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    assetTransaction.isDeleted = true
    await AssetTransaction.findByIdAndUpdate(assetTransaction._id, assetTransaction, { new: true })
    res.status(204).end()
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to delete an asset transaction'
    })
  }
})

module.exports = assetTransactionRouter