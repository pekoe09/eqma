const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Equipment = require('../models/equipment')
const { initialEquipment, equipmentInDb, nonExistingId, initEquipments } = require('./equipmentstesthelper')

describe('GET /api/equipment', () => {
  beforeAll(async () => {
    await initEquipments()
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
    await initEquipments()
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

describe('PUT /api/equipment/:id', () => {
  beforeEach(async () => {
    await initEquipments()
  })

  it('updates an existing equipment', async () => {
    const equipmentBefore = await equipmentInDb()

    const target = equipmentBefore[1]
    target.name = 'Updatedname'
    target.make = 'Updatedmake'
    target.model = 'Updatedmodel'
    target.description = 'Updateddescription'
    target.price = 1
    target.timeUnit = 'year'

    await api
      .put(`/api/equipment/${target._id}`)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const equipmentAfter = await equipmentInDb()
    const match = equipmentAfter.find(e => e._id.toString() === target._id.toString())
    expect(equipmentAfter.length).toBe(equipmentBefore.length)
    expect(match.toJSON()).toEqual(target.toJSON())
  })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExistingId()
    const equipmentBefore = await equipmentInDb()

    const target = equipmentBefore[1]
    target.name = 'Updatedname'

    await api
      .put(`/api/equipment/${nonId}`)
      .send(target)
      .expect(400)

    const equipmentAfter = await equipmentInDb()
    const names = equipmentAfter.map(e => e.name)
    expect(equipmentAfter.length).toBe(equipmentBefore.length)
    expect(names).not.toContain(target.name)
  })

  it('does not accept equipment without a name', async () => {
    const equipmentBefore = await equipmentInDb()

    const originalTarget = equipmentBefore[1]
    const target = {
      make: 'Updatedmake',
      model: 'Updatedmodel',
      description: 'Updateddescription',
      price: 1,
      timeUnit: 'year'
    }

    await api
      .put(`/api/equipment/${originalTarget._id}`)
      .send(target)
      .expect(400)

    const equipmentAfter = await equipmentInDb()
    const match = equipmentAfter.find(e => e._id.toString() === originalTarget._id.toString())
    expect(equipmentAfter.length).toBe(equipmentBefore.length)
    expect(match.toJSON()).toEqual(originalTarget.toJSON())
  })

  it('does not accept equipment with an empty string as a name', async () => {
    const equipmentBefore = await equipmentInDb()

    const originalTarget = equipmentBefore[1]
    const target = {
      name: '',
      make: 'Updatedmake',
      model: 'Updatedmodel',
      description: 'Updateddescription',
      price: 1,
      timeUnit: 'year'
    }

    await api
      .put(`/api/equipment/${originalTarget._id}`)
      .send(target)
      .expect(400)

    const equipmentAfter = await equipmentInDb()
    const match = equipmentAfter.find(e => e._id.toString() === originalTarget._id.toString())
    expect(equipmentAfter.length).toBe(equipmentBefore.length)
    expect(match.toJSON()).toEqual(originalTarget.toJSON())
  })
})

describe('DELETE /api/equipment/:id', () => {
  beforeEach(async () => {
    await initEquipments()
  })

  it('deletes the correct equipment', async () => {
    const equipmentBefore = await equipmentInDb()

    await api
      .delete(`/api/equipment/${equipmentBefore[1]._id}`)
      .expect(204)

    const equipmentAfter = await equipmentInDb()
    const ids = equipmentAfter.map(e => e._id.toString())
    expect(equipmentAfter.length).toBe(equipmentBefore.length - 1)
    expect(ids).not.toContain(equipmentBefore[1]._id.toString())
  })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExistingId()
    const equipmentBefore = await equipmentInDb()

    await api
      .delete(`/api/equipment/${nonId}`)
      .expect(400)

    const equipmentAfter = await equipmentInDb()
    expect(equipmentAfter.length).toBe(equipmentBefore.length)
  })
})

afterAll(async () => {
  await server.close()
})