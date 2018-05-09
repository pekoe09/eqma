const EquipmentUnit = require('../models/equipmentUnit')

const initialEquipmentUnits = [
  {

  },
  {

  },
  {

  }
]

const equipmentUnitsInDb = async () => {
  const equipmentUnits = await EquipmentUnit.find({})
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
  const equipmentUnitObjects = initialEquipmentUnits.map(e => new EquipmentUnit(e))
  const promiseArray = equipmentUnitObjects.map(e = > e.save())
  await Promise.all(promiseArray)
}

module.exports = {
  initialEquipmentUnits,
  equipmentUnitsInDb,
  nonExistingId,
  initEquipmentUnits
}