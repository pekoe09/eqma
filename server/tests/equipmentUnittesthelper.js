const EquipmentUnit = require('../models/equipmentUnit')
const { equipmentInDb } = require('./equipmentstesthelper')

const initialEquipmentUnits = [
  {
    registration: '1111',
    VIN: 'aaaa',
    assetID: 'ID1'
  },
  {
    registration: '1111',
    VIN: 'aaaa',
    assetID: 'ID1'
  },
  {
    registration: '1111',
    VIN: 'aaaa',
    assetID: 'ID1'
  }
]

const equipmentUnitsInDb = async () => {
  const equipmentUnits = await EquipmentUnit
    .find({})
    .populate({
      path: 'equipment',
      populate: {
        path: 'equipmentType'
      }
    })
  return equipmentUnits
}

const nonExistingId = async () => {
  const equipmentUnit = new EquipmentUnit({
    assetID: '123'
  })
  const savedEquipmentUnit = await equipmentUnit.save()
  const id = savedEquipmentUnit._id
  await EquipmentUnit.findByIdAndRemove(id)
  return id
}

const initEquipmentUnits = async () => {
  await EquipmentUnit.remove({})
  const equipment = equipmentInDb()
  const equipmentUnitObjects = initialEquipmentUnits.map(e => new EquipmentUnit({
    registration: e.registration,
    VIN: e.VIN,
    assetID: e.assetID,
    equipment: equipment[0]
  }))
  const promiseArray = equipmentUnitObjects.map(e => e.save())
  await Promise.all(promiseArray)
}

module.exports = {
  initialEquipmentUnits,
  equipmentUnitsInDb,
  nonExistingId,
  initEquipmentUnits
}