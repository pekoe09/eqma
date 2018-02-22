const Equipment = require('../models/equipment')

const initialEquipment = [
  {
    name: 'Testequip1',
    make: 'Make1',
    model: 'Model1',
    description: 'Testequipment description 1',
    features: [{
      key: 'engine',
      value: 'v8'
    }],
    price: 150,
    timeUnit: 'day'
  },
  {
    name: 'Testequip2',
    make: 'Make2',
    model: 'Model2',
    description: 'Testequipment description 2',
    features: [{
      key: 'engine',
      value: 'straight 6'
    }],
    price: 100,
    timeUnit: 'day'
  },
  {
    name: 'Testequip3',
    make: 'Make1',
    model: 'Model3',
    description: 'Testequipment description 3',
    features: [{
      key: 'engine',
      value: 'wankel'
    }],
    price: 15,
    timeUnit: 'hour'
  }
]

const equipmentInDb = async () => {
  const equipment = await Equipment.find({})
  return equipment
}

const nonExistingId = async () => {
  const equipment = new Equipment({
    name: 'nonequip',
    make: 'nonequip',
    price: 1,
    timeUnit: 'day'
  })
  const savedEquip = await equipment.save()
  const id = savedEquip._id
  await Equipment.findByIdAndRemove(id)
  return id
}

module.exports = { initialEquipment, equipmentInDb, nonExistingId }