const equipmentTypeRouter = require('express').Router()
const EquipmentType = require('../models/equipmentType')
const _ = require('lodash')

equipmentTypeRouter.get('/', async (req, res) => {
  const equipmentTypes = await EquipmentType
    .find({})
    .populate('parentType, childTypes')
  res.json(equipmentTypes)
})

equipmentTypeRouter.post('/', async (req, res) => {
  try {
    const body = req.body
    if (!body.name) {
      return res.status(400).json({ error: 'name is missing' })
    }

    const equipmentType = new EquipmentType({
      name: body.name,
      parentType: body.parentType,
      childTypes: [],
      equipment: []
    })

    let parentType = null
    if (body.parentType) {
      parentType = await EquipmentType.findById(body.parentType)
      if (!parentType) {
        return res.status(400).json({ error: 'parent type cannot be found' })
      }
    }
    let savedEquipmentType = await equipmentType.save()
    if (parentType) {
      parentType.childTypes = parentType.childTypes.concat(savedEquipmentType._id)
      await EquipmentType.findByIdAndUpdate(parentType._id, parentType)
    }
    savedEquipmentType = await EquipmentType
      .findById(savedEquipmentType._id)
      .populate('parentType')
    res.status(201).json(savedEquipmentType)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to create an equipment type'
    })
  }
})

equipmentTypeRouter.put('/:id', async (req, res) => {
  try {
    const match = await EquipmentType.findById(req.params.id)
    if (!match) {
      return res.status(400).json({ error: 'nonexistent id' })
    }

    const body = req.body
    if (!body.name) {
      return res.status(400).json({ error: 'name is missing' })
    }

    const equipmentType = {
      name: body.name,
      parentType: body.parentType,
      childTypes: match.childTypes,
      equipment: match.equipment
    }
    if (match.parentType !== body.parentType) {
      if (match.parentType) {
        let oldParent = await EquipmentType.findById(match.parentType)
        oldParent.childTypes = _.remove(oldParent.childTypes, c => c === match._id)
        await EquipmentType.findByIdAndUpdate(oldParent._id, oldParent)
      }
      if (body.parentType) {
        let newParent = await EquipmentType.findById(body.parentType)
        newParent.childTypes = newParent.childTypes.concat(match._id)
        await EquipmentType.findByIdAndUpdate(newParent._id, newParent)
      }
    }

    const updatedEquipmentType = await EquipmentType
      .findByIdAndUpdate(req.params.id, equipmentType, { new: true })
      .populate('parentType', 'childTypes')
    res.json(updatedEquipmentType)
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to update an equipment type'
    })
  }
})

equipmentTypeRouter.delete('/:id', async (req, res) => {
  try {
    const equipmentType = await EquipmentType.findById(req.params.id)
    if (!equipmentType) {
      return res.status(400).json({ error: 'nonexistent id' })
    }
    // removed from parent's child list; if there are children,
    // their new parent is this equipment type's parent
    let parentId = equipmentType.parentType
    if (parentId) {
      let parent = await EquipmentType.findById(parentId)
      parent.childTypes = _.remove(parent.childTypes, c => c === equipmentType._id)
      parent.childTypes = parent.childTypes.concat(equipmentType.childTypes)
      await EquipmentType.findByIdAndUpdate(parentId, parent)
    }
    equipmentType.childTypes.forEach(async c => {
      let child = await EquipmentType.findById(c)
      child.parentType = parentId
      await EquipmentType.findByIdAndUpdate(c, child)
    })

    await EquipmentType.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (exception) {
    console.log(exception)
    res.status(500).json({
      error: 'encountered an error while trying to delete an equipment type'
    })
  }
})

module.exports = equipmentTypeRouter