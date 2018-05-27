const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { getToken } = require('./usertesthelper')
const {
  initialEquipmentTypes,
  equipmentTypesInDb,
  nonExistingId,
  initEquipmentTypes
} = require('./equipmentTypetesthelper')

describe('GET /api/equipmenttypes', () => {

  let token = null

  beforeAll(async () => {
    await initEquipmentTypes()
    token = await getToken('testadmin3')
  })

  it('works', async () => {
    await api
      .get('/api/equipmenttypes')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('returns equipment types as json', async () => {
    await api
      .get('/api/equipmenttypes')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the corrent number of equipment types', async () => {
    const response = await api
      .get('/api/equipmenttypes')
      .set('Authorization', 'Bearer ' + token)

    expect(response.body.length).toBe(initialEquipmentTypes.length)
  })

  it('returns all equipment types', async () => {
    const response = await api
      .get('/api/equipmenttypes')
      .set('Authorization', 'Bearer ' + token)

    const equipmentTypeNames = response.body.map(e => e.name)
    initialEquipmentTypes.forEach(e => expect(equipmentTypeNames).toContain(e.name))
  })
})

describe('POST /api/equipmenttypes', () => {

  let token = null

  beforeEach(async () => {
    await initEquipmentTypes()
    token = await getToken('testadmin3')
  })

  it('adds an equipment type', async () => {
    const equipmentTypesBefore = await equipmentTypesInDb()

    const newEquipmentType = {
      name: 'Testequip4',
      parentType: equipmentTypesBefore[0]._id
    }

    await api
      .post('/api/equipmenttypes')
      .set('Authorization', 'Bearer ' + token)
      .send(newEquipmentType)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const equipmentTypesAfter = await equipmentTypesInDb()
    const equipmentTypeNames = equipmentTypesAfter.map(e => e.name)

    expect(equipmentTypesAfter.length).toBe(equipmentTypesBefore.length + 1)
    expect(equipmentTypeNames).toContain(newEquipmentType.name)
  })

  it('adds a child equipment type to the parents children', async () => {
    const equipmentTypesBefore = await equipmentTypesInDb()

    const newEquipmentType = {
      name: 'Testequip4',
      parentType: equipmentTypesBefore[0]._id
    }

    const response = await api
      .post('/api/equipmenttypes')
      .set('Authorization', 'Bearer ' + token)
      .send(newEquipmentType)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const equipmentTypesAfter = await equipmentTypesInDb()
    const parentType = equipmentTypesAfter.find(e => e._id.toString() === equipmentTypesBefore[0]._id.toString())
    expect(parentType.childTypes.length).toBe(1)
    expect(parentType.childTypes[0].toString()).toEqual(response.body._id)
  })

  it('does not accept an equipment type without a name', async () => {
    const newEquipmentType = {}

    const equipmentTypesBefore = await equipmentTypesInDb()

    const response = await api
      .post('/api/equipmenttypes')
      .set('Authorization', 'Bearer ' + token)
      .send(newEquipmentType)
      .expect(400)

    const equipmentTypesAfter = await equipmentTypesInDb()
    expect(equipmentTypesAfter.length).toBe(equipmentTypesBefore.length)
    expect(response.body).toEqual({ error: 'name is missing' })
  })

  it('does not accept an equipment type with an empty string as a name', async () => {
    const newEquipmentType = {
      name: ''
    }

    const equipmentTypesBefore = await equipmentTypesInDb()

    const response = await api
      .post('/api/equipmenttypes')
      .set('Authorization', 'Bearer ' + token)
      .send(newEquipmentType)
      .expect(400)

    const equipmentTypesAfter = await equipmentTypesInDb()
    expect(equipmentTypesAfter.length).toBe(equipmentTypesBefore.length)
    expect(response.body).toEqual({ error: 'name is missing' })
  })
})

describe('PUT /api/equipmenttypes/:id', () => {

  let token = null

  beforeEach(async () => {
    await initEquipmentTypes()
    token = await getToken('testadmin3')
  })

  it('updates an existing equipment type', async () => {
    const equipmentTypesBefore = await equipmentTypesInDb()

    const target = equipmentTypesBefore[1]
    target.name = 'Updatedname'

    await api
      .put(`/api/equipmenttypes/${target._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const equipmentTypesAfter = await equipmentTypesInDb()
    const match = equipmentTypesAfter.find(e => e._id.toString() === target._id.toString())
    expect(equipmentTypesAfter.length).toBe(equipmentTypesBefore.length)
    expect(match.toJSON()).toEqual(target.toJSON())
  })

  it('updates the parent types children', async () => {
    const equipmentTypesBefore = await equipmentTypesInDb()

    const newEquipmentType = {
      name: 'Testequip4',
      parentType: equipmentTypesBefore[0]._id
    }

    const response = await api
      .post('/api/equipmenttypes')
      .set('Authorization', 'Bearer ' + token)
      .send(newEquipmentType)

    const target = response.body
    target.name = 'Updatedname'
    target.parentType = equipmentTypesBefore[1]._id

    await api
      .put(`/api/equipmenttypes/${target._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)

    const equipmentTypesAfter = await equipmentTypesInDb()
    const oldParent = equipmentTypesAfter.find(e => e._id.toString() === equipmentTypesBefore[0]._id.toString())
    const newParent = equipmentTypesAfter.find(e => e._id.toString() === equipmentTypesBefore[1]._id.toString())
    expect(oldParent.childTypes.length).toBe(0)
    expect(newParent.childTypes.length).toBe(1)
    expect(newParent.childTypes[0].toString()).toEqual(target._id.toString())
  })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExistingId()
    const equipmentTypesBefore = await equipmentTypesInDb()

    const target = equipmentTypesBefore[1]
    target.name = 'Updatedname'

    await api
      .put(`/api/equipmenttypes/${nonId}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const equipmentTypesAfter = await equipmentTypesInDb()
    const names = equipmentTypesAfter.map(e => e.name)
    expect(equipmentTypesAfter.length).toBe(equipmentTypesBefore.length)
    expect(names).not.toContain(target.name)
  })

  it('does not accept equipment type without a name', async () => {
    const equipmentTypesBefore = await equipmentTypesInDb()

    const originalTarget = equipmentTypesBefore[1]
    const target = {}

    await api
      .put(`/api/equipmenttypes/${originalTarget._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const equipmentTypesAfter = await equipmentTypesInDb()
    const match = equipmentTypesAfter.find(e => e._id.toString() === originalTarget._id.toString())
    expect(equipmentTypesAfter.length).toBe(equipmentTypesBefore.length)
    expect(match.toJSON()).toEqual(originalTarget.toJSON())
  })

  it('does not accept equipment type with an empty string as a name', async () => {
    const equipmentTypesBefore = await equipmentTypesInDb()

    const originalTarget = equipmentTypesBefore[1]
    const target = {
      name: ''
    }

    await api
      .put(`/api/equipmenttypes/${originalTarget._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const equipmentTypesAfter = await equipmentTypesInDb()
    const match = equipmentTypesAfter.find(e => e._id.toString() === originalTarget._id.toString())
    expect(equipmentTypesAfter.length).toBe(equipmentTypesBefore.length)
    expect(match.toJSON()).toEqual(originalTarget.toJSON())
  })
})

describe('DELETE /api/equipmenttypes/:id', () => {

  let token = null

  beforeEach(async () => {
    await initEquipmentTypes()
    token = await getToken('testadmin3')
  })

  it('deletes the correct equipment type', async () => {
    const equipmentTypesBefore = await equipmentTypesInDb()

    await api
      .delete(`/api/equipmenttypes/${equipmentTypesBefore[1]._id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const equipmentTypesAfter = await equipmentTypesInDb()
    const ids = equipmentTypesAfter.map(e => e._id.toString())
    expect(equipmentTypesAfter.length).toBe(equipmentTypesBefore.length - 1)
    expect(ids).not.toContain(equipmentTypesBefore[1]._id.toString())
  })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExistingId()
    const equipmentTypesBefore = await equipmentTypesInDb()

    await api
      .delete(`/api/equipmenttypes/${nonId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)

    const equipmentTypesAfter = await equipmentTypesInDb()
    expect(equipmentTypesAfter.length).toBe(equipmentTypesBefore.length)
  })
})

afterAll(async () => {
  await server.close()
})