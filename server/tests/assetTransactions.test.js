const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { getToken } = require('./usertesthelper')
const { initialTransactions, transactionsInDb, nonExistingId, initTransactions } = require('./assetTransactionstesthelper')
const { equipmentUnitsInDb } = require('./equipmentUnittesthelper')

describe('GET /api/assettransactions', () => {

  let token = null

  beforeAll(async () => {
    await initTransactions()
    token = await getToken('testadmin3')
  })

  it('works', async () => {
    await api
      .get('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('prevents access without authentication', async () => {
    await api
      .get('/api/assettransactions')
      .expect(403)
  })

  it('returns asset transactions as json', async () => {
    await api
      .get('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the corrent number of asset transactions', async () => {
    const response = await api
      .get('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)

    const initialTransactionsArray = await initialTransactions()
    expect(response.body.length).toBe(initialTransactionsArray.length)
  })

})

describe('POST /api/assettransactions', () => {

  let token = null

  beforeEach(async () => {
    await initTransactions()
    token = await getToken('testadmin3')
  })

  it('adds an asset transaction', async () => {
    const equipmentUnits = await equipmentUnitsInDb()
    const newTransaction = {
      equipmentUnit: equipmentUnits[1]._id,
      date: new Date(),
      type: 'purchase',
      value: 1000,
      description: 'testing POST request success'
    }

    const transactionsBefore = await transactionsInDb()

    await api
      .post('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)
      .send(newTransaction)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const transactionsAfter = await transactionsInDb()
    const descriptions = transactionsAfter.map(t => t.description)

    expect(transactionsAfter.length).toBe(transactionsBefore.length + 1)
    expect(descriptions).toContain(newTransaction.description)
  })

  it('adds the transaction ref on the equipment unit', async () => {
    const equipmentUnits = await equipmentUnitsInDb()
    const newTransaction = {
      equipmentUnit: equipmentUnits[1]._id,
      date: new Date(),
      type: 'purchase',
      value: 1000,
      description: 'testing POST request success'
    }

    const response = await api
      .post('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)
      .send(newTransaction)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    const equipmentUnit = equipmentUnitsAfter.find(e => e._id.toString() === newTransaction.equipmentUnit.toString())

    expect(equipmentUnit.transactions.length).toBe(equipmentUnits[1].transactions.length + 1)
    expect(equipmentUnit.transactions).toContain(response.body._id.toString())
  })

  it('prevents adding an asset transaction without authentication', async () => {
    const equipmentUnits = await equipmentUnitsInDb()
    const transactionsBefore = await transactionsInDb()

    const newTransaction = {
      equipmentUnit: equipmentUnits[1]._id,
      date: new Date(),
      type: 'purchase',
      value: 1000,
      description: 'testing POST request success'
    }

    await api
      .post('/api/assettransactions')
      .send(newTransaction)
      .expect(403)

    const transactionsAfter = await transactionsInDb()
    const descriptions = transactionsAfter.map(t => t.description)
    expect(transactionsAfter.length).toBe(transactionsBefore.length)
    expect(descriptions).not.toContain(newTransaction.description)
  })

  it('returns error for nonexisting equipment id', async () => {
    const nonId = await nonExistingId()
    const newTransaction = {
      equipmentUnit: nonId,
      date: new Date(),
      type: 'purchase',
      value: 1000,
      description: 'testing POST request fail nonexistent equipment id'
    }

    const transactionsBefore = await transactionsInDb()

    await api
      .post('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)
      .send(newTransaction)
      .expect(400)

    const transactionsAfter = await transactionsInDb()
    const descriptions = transactionsAfter.map(t => t.description)
    expect(transactionsAfter.length).toBe(transactionsBefore.length)
    expect(descriptions).not.toContain(newTransaction.description)
  })

  it('does not accept an asset transaction without an equipment unit', async () => {
    const newTransaction = {
      date: new Date(),
      type: 'purchase',
      value: 1000,
      description: 'testing POST request fail no equipment unit'
    }

    const transactionsBefore = await transactionsInDb()

    await api
      .post('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)
      .send(newTransaction)
      .expect(400)

    const transactionsAfter = await transactionsInDb()
    const descriptions = transactionsAfter.map(t => t.description)
    expect(transactionsAfter.length).toBe(transactionsBefore.length)
    expect(descriptions).not.toContain(newTransaction.description)
  })

  it('does not accept an asset transaction without a date', async () => {
    const equipmentUnits = await equipmentUnitsInDb()
    const newTransaction = {
      equipmentUnit: equipmentUnits[1]._id,
      type: 'purchase',
      value: 1000,
      description: 'testing POST request fail no date'
    }

    const transactionsBefore = await transactionsInDb()

    await api
      .post('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)
      .send(newTransaction)
      .expect(400)

    const transactionsAfter = await transactionsInDb()
    const descriptions = transactionsAfter.map(t => t.description)
    expect(transactionsAfter.length).toBe(transactionsBefore.length)
    expect(descriptions).not.toContain(newTransaction.description)
  })

  it('does not accept an asset transaction without a type', async () => {
    const equipmentUnits = await equipmentUnitsInDb()
    const newTransaction = {
      equipmentUnit: equipmentUnits[1]._id,
      date: new Date(),
      value: 1000,
      description: 'testing POST request fail no type'
    }

    const transactionsBefore = await transactionsInDb()

    await api
      .post('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)
      .send(newTransaction)
      .expect(400)

    const transactionsAfter = await transactionsInDb()
    const descriptions = transactionsAfter.map(t => t.description)
    expect(transactionsAfter.length).toBe(transactionsBefore.length)
    expect(descriptions).not.toContain(newTransaction.description)
  })

  it('does not accept an asset transaction without a value', async () => {
    const equipmentUnits = await equipmentUnitsInDb()
    const newTransaction = {
      equipmentUnit: equipmentUnits[1]._id,
      date: new Date(),
      type: 'purchase',
      description: 'testing POST request fail no value'
    }

    const transactionsBefore = await transactionsInDb()

    await api
      .post('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)
      .send(newTransaction)
      .expect(400)

    const transactionsAfter = await transactionsInDb()
    const descriptions = transactionsAfter.map(t => t.description)
    expect(transactionsAfter.length).toBe(transactionsBefore.length)
    expect(descriptions).not.toContain(newTransaction.description)
  })

  it('does not accept an asset transaction without a description', async () => {
    const equipmentUnits = await equipmentUnitsInDb()
    const newTransaction = {
      equipmentUnit: equipmentUnits[1]._id,
      date: new Date(),
      type: 'purchase',
      value: 1000
    }

    const transactionsBefore = await transactionsInDb()

    await api
      .post('/api/assettransactions')
      .set('Authorization', 'Bearer ' + token)
      .send(newTransaction)
      .expect(400)

    const transactionsAfter = await transactionsInDb()
    const descriptions = transactionsAfter.map(t => t.description)
    expect(transactionsAfter.length).toBe(transactionsBefore.length)
    expect(descriptions).not.toContain(newTransaction.description)
  })
})

describe('PUT /api/assettransactions/:id', () => {

  let token = null

  beforeEach(async () => {
    await initTransactions()
    token = await getToken('testadmin3')
  })

  it('updates an existing asset transaction', async () => {
    const transactionsBefore = await transactionsInDb()
    const equipmentUnitsBefore = await equipmentUnitsInDb()

    const target = transactionsBefore[1]
    target.equipmentUnit = equipmentUnitsBefore[2]
    target.date = new Date()
    target.type = 'New type'
    target.value = 999
    target.description = 'New description'

    const response = await api
      .put(`/api/assettransactions/${target._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const transactionsAfter = await transactionsInDb()
    const oldTransaction = transactionsAfter.find(t => t._id.toString() === target._id.toString())
    const newTransaction = transactionsAfter.find(t => t._id.toString() === response.body._id.toString())
    expect(transactionsAfter.length).toBe(transactionsBefore.length + 1)
    expect(oldTransaction._id.toString()).not.toEqual(newTransaction._id.toString())
    expect(oldTransaction.isDeleted).toBeTruthy()
    expect(newTransaction.isDeleted).toBeFalsy()
    expect(oldTransaction.successor.toString()).toEqual(newTransaction._id.toString())
    expect(newTransaction.predecessor.toString()).toEqual(oldTransaction._id.toString())
  })

  it('prevents updating without authentication', async () => {

  })

  it('returns error for nonexisting id', async () => {

  })

  it('updates equipment unit ref correctly', async () => {

  })

  it('does not accept an asset transaction without an equipment unit', async () => {

  })

  it('returns error for nonexisting equipment unit id', async () => {

  })

  it('does not accept an asset transaction without a date', async () => {

  })

  it('does not accept an asset transaction without a type', async () => {

  })

  it('does not accept an asset transaction without a value', async () => {

  })

  it('does not accept an asset transaction without a description', async () => {

  })

})

describe('DELETE /api/assettransactions/:id', () => {

  let token = null

  beforeEach(async () => {
    await initTransactions()
    token = await getToken('testadmin3')
  })

  it('marks the correct asset transaction as deleted', async () => {
    const transactionsBefore = await transactionsInDb()
    const deletedBefore = transactionsBefore.filter(t => t.isDeleted)

    await api
      .delete(`/api/assettransactions/${transactionsBefore[1]._id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const transactionsAfter = await transactionsInDb()
    const deletedAfter = transactionsAfter.filter(t => t.isDeleted).map(t => t._id.toString())
    expect(deletedAfter.length).toBe(deletedBefore.length + 1)
    expect(deletedAfter).toContain(transactionsBefore[1]._id.toString())
  })

  it('prevents operation without authentication', async () => {
    const transactionsBefore = await transactionsInDb()
    const deletedBefore = transactionsBefore.filter(t => t.isDeleted)

    await api
      .delete(`/api/assettransactions/${transactionsBefore[1]._id}`)
      .expect(403)

    const transactionsAfter = await transactionsInDb()
    const deletedAfter = transactionsAfter.filter(t => t.isDeleted).map(t => t._id.toString())
    expect(deletedAfter.length).toBe(deletedBefore.length)
    expect(deletedAfter).not.toContain(transactionsBefore[1]._id.toString())
  })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExistingId()
    const transactionsBefore = await transactionsInDb()
    const deletedBefore = transactionsBefore.filter(t => t.isDeleted)

    await api
      .delete(`/api/assettransactions/${nonId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)

    const transactionsAfter = await transactionsInDb()
    const deletedAfter = transactionsAfter.filter(t => t.isDeleted)
    expect(deletedAfter.length).toBe(deletedBefore.length)
  })

})

afterAll(async () => {
  await server.close()
})