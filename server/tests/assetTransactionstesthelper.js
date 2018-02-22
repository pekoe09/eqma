const AssetTransaction = require('../models/assetTransaction')
const { equipmentInDb, initEquipments } = require('./equipmentstesthelper')

const initialTransactions = async () => {
  const transactions = []
  const equipments = await equipmentInDb()
  let i, j
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      transactions.push({
        equipment: equipments[i]._id,
        date: new Date(),
        type: 'test',
        value: 100 * (i + 1) * (j + 1),
        description: 'description ' + i + '-' + j,
        isDeleted: false
      })
    }
  }
  return transactions
}

const transactionsInDb = async () => {
  const assetTransactions = await AssetTransaction.find({})
  return assetTransactions
}

const nonExistingId = async () => {
  const equipments = await equipmentInDb()
  const assetTransaction = new AssetTransaction({
    equipment: equipments[1]._id,
    date: new Date(),
    type: 'test',
    value: 100,
    description: 'a',
    isDeleted: false
  })
  const savedTransaction = await assetTransaction.save()
  const id = savedTransaction._id
  await AssetTransaction.findByIdAndRemove(id)
  return id
}

const initTransactions = async () => {
  await initEquipments()
  await AssetTransaction.remove({})
  const transactionArray = await initialTransactions()
  const transactionObjects = transactionArray.map(t => new AssetTransaction(t))
  const promiseArray = transactionObjects.map(t => t.save())
  await Promise.all(promiseArray)
}

module.exports = {
  initialTransactions,
  transactionsInDb,
  nonExistingId,
  initTransactions
}