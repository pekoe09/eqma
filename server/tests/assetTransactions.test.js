const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const AssetTransaction = require('../models/assetTransaction')
const { getToken } = require('./usertesthelper')
const { initialTransactions, transactionsInDb, nonExistingId, initTransactions } = require('./assetTransactionstesthelper')
const { equipmentInDb } = require('./equipmentstesthelper')

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
    const equipments = await equipmentInDb()
    const newTransaction = {
      equipment: equipments[1]._id,
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

  it('returns error for nonexisting equipment id', async () => {
    const nonId = await nonExistingId()
    const newTransaction = {
      equipment: nonId,
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

  it('does not accept an asset transaction without an equipment', async () => {
    const newTransaction = {
      date: new Date(),
      type: 'purchase',
      value: 1000,
      description: 'testing POST request fail no equipment'
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
    const equipments = await equipmentInDb()
    const newTransaction = {
      equipment: equipments[1]._id,
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
    const equipments = await equipmentInDb()
    const newTransaction = {
      equipment: equipments[1]._id,
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
    const equipments = await equipmentInDb()
    const newTransaction = {
      equipment: equipments[1]._id,
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
    const equipments = await equipmentInDb()
    const newTransaction = {
      equipment: equipments[1]._id,
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

describe.skip('PUT /api/assettransactions/:id', () => {

})

describe.skip('DELETE /api/assettransactions/:id', () => {

})

afterAll(async () => {
  await server.close()
})