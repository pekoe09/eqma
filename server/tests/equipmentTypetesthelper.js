const EquipmentType = require('../models/equipmentType')

const initialEquipmentTypes = [
  {
    name: 'EType1',
    parentType: null,
    childTypes: [],
    equipment: []
  },
  {
    name: 'EType2',
    parentType: null,
    childTypes: [],
    equipment: []
  },
  {
    name: 'EType3',
    parentType: null,
    childTypes: [],
    equipment: []
  }
]

const equipmentTypesInDb = async () => {
  const equipmentTypes = await EquipmentType.find({})
  return equipmentTypes
}

const nonExistingId = async () => {
  const equipmentType = new EquipmentType({
    name: 'nonequiptype'
  })
  const savedEquipmentType = await equipmentType.save()
  const id = savedEquipmentType._id
  await EquipmentType.findByIdAndRemove(id)
  return id
}

const initEquipmentTypes = async () => {
  await EquipmentType.remove({})
  const equipmentTypeObjects = initialEquipmentTypes.map(e => new EquipmentType(e))
  const promiseArray = equipmentTypeObjects.map(e => e.save())
  await Promise.all(promiseArray)
}

module.exports = {
  initialEquipmentTypes,
  equipmentTypesInDb,
  nonExistingId,
  initEquipmentTypes
}