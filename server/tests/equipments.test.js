const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Equipment = require('../models/equipment')
const { initialEquipment, equipmentInDb } = require('./equipmentstesthelper')

describe('GET /api/equipment', () => {
  beforeAll(async () => {
    await Equipment.remove({})
    const equipmentObjects = initialEquipment.map(e => new Equipment(e))
    const promiseArray = equipmentObjects.map(e => e.save())
    await Promise.all(promiseArray)
  })

  it('works', async () => {
    await api
      .get('/api/equipment')
      .expect(200)
  })

  it('returns equipment as json', async () => {
    await api
      .get('/api/equipment')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the corrent number of equipment', async () => {
    const response = await api
      .get('/api/equipment')

    expect(response.body.length).toBe(initialEquipment.length)
  })

  it('returns all equipment', async () => {
    const response = await api
      .get('/api/equipment')

    const equipmentNames = response.body.map(e => e.name)
    initialEquipment.forEach(e => expect(equipmentNames).toContain(e.name))
  })
})

describe('POST /api/equipment', () => {
  beforeEach(async () => {
    await Equipment.remove({})
    const equipmentObjects = initialEquipment.map(e => new Equipment(e))
    const promiseArray = equipmentObjects.map(e => e.save())
    await Promise.all(promiseArray)
  })

  it('adds an equipment', async () => {
    const newEquipment = {
      name: 'Testequip4',
      make: 'Make4',
      model: 'Model4',
      description: 'Testequipment description 4',
      features: [{
        key: 'engine',
        value: 'v4'
      }],
      price: 40,
      timeUnit: 'hour'
    }

    const equipmentBefore = await equipmentInDb()

    await api
      .post('/api/equipment')
      .send(newEquipment)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const equipmentAfter = await equipmentInDb()
    const equipmentNames = equipmentAfter.map(e => e.name)

    expect(equipmentAfter.length).toBe(equipmentBefore.length + 1)
    expect(equipmentNames).toContain(newEquipment.name)
  })

  it('does not accept an equipment without a name', async () => {
    const newEquipment = {
      make: 'Make4',
      model: 'Model4',
      description: 'Testequipment description 4',
      features: [{
        key: 'engine',
        value: 'v4'
      }],
      price: 40,
      timeUnit: 'hour'
    }

    const equipmentBefore = await equipmentInDb()

    const response = await api
      .post('/api/equipment')
      .send(newEquipment)
      .expect(400)

    const equipmentAfter = await equipmentInDb()
    expect(equipmentAfter.length).toBe(equipmentBefore.length)
    expect(response.body).toEqual({ error: 'name is missing' })
  })

  it('does not accept an equipment with an empty string as a name', async () => {
    const newEquipment = {
      name: '',
      make: 'Make4',
      model: 'Model4',
      description: 'Testequipment description 4',
      features: [{
        key: 'engine',
        value: 'v4'
      }],
      price: 40,
      timeUnit: 'hour'
    }

    const equipmentBefore = await equipmentInDb()

    const response = await api
      .post('/api/equipment')
      .send(newEquipment)
      .expect(400)

    const equipmentAfter = await equipmentInDb()
    expect(equipmentAfter.length).toBe(equipmentBefore.length)
    expect(response.body).toEqual({ error: 'name is missing' })
  })
})

afterAll(async () => {
  await server.close()
})