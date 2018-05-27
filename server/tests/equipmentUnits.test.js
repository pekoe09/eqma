const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { getToken } = require('./usertesthelper')
const {
  equipmentUnitsInDb,
  nonExistingId,
  initEquipmentUnits,
  initialEquipmentUnits
} = require('./equipmentUnittesthelper')
const {
  equipmentInDb,
  initEquipments
} = require('./equipmentstesthelper')

describe('GET /api/equipmentunits', () => {

  let token = null

  beforeAll(async () => {
    await initEquipmentUnits()
    token = await getToken('testadmin3')
  })

  it('works', async () => {
    await api
      .get('/api/equipmentunits')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('prevents access without authentication', async () => {
    await api
      .get('/api/equipmentunits')
      .expect(403)
  })

  it('returns equipment units as json', async () => {
    await api
      .get('/api/equipmentunits')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the corrent number of equipment units', async () => {
    const response = await api
      .get('/api/equipmentunits')
      .set('Authorization', 'Bearer ' + token)

    expect(response.body.length).toBe(initialEquipmentUnits.length)
  })

  it('returns all equipment units', async () => {
    const response = await api
      .get('/api/equipmentunits')
      .set('Authorization', 'Bearer ' + token)

    const equipmentUnitNames = response.body.map(e => e.name)
    initialEquipmentUnits.forEach(e => expect(equipmentUnitNames).toContain(e.name))
  })
})

describe('POST /api/equipmentunits', () => {

  let token = null

  beforeEach(async () => {
    await initEquipmentUnits()
    await initEquipments()
    token = await getToken('testadmin3')
  })

  it('adds an equipment unit', async () => {
    const equipmentUnitsBefore = await equipmentUnitsInDb()
    const equipments = await equipmentInDb()

    const newEquipmentUnit = {
      equipment: equipments[1],
      registration: '123245',
      VIN: 'abcde',
      assetID: 'Testequip4'
    }

    await api
      .post('/api/equipmentunits')
      .set('Authorization', 'Bearer ' + token)
      .send(newEquipmentUnit)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    const equipmentUnitAssetIDs = equipmentUnitsAfter.map(e => e.assetId)

    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length + 1)
    expect(equipmentUnitAssetIDs).toContain(newEquipmentUnit.assetId)
  })

  it('prevents adding an equipment unit without authentication', async () => {
    const equipmentUnitsBefore = await equipmentUnitsInDb()
    const equipment = await equipmentInDb()

    const newEquipmentUnit = {
      equipment: equipment[1],
      registration: '123245',
      VIN: 'abcde',
      assetID: 'Testequip4'
    }

    await api
      .post('/api/equipmentunits')
      .send(newEquipmentUnit)
      .expect(403)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length)
  })

  it('adds a child equipment unit to the equipments units', async () => {
    const equipments = await equipmentInDb()

    const newEquipmentUnit = {
      equipment: equipments[1],
      registration: '123245',
      VIN: 'abcde',
      assetID: 'Testequip4'
    }

    const response = await api
      .post('/api/equipmentunits')
      .set('Authorization', 'Bearer ' + token)
      .send(newEquipmentUnit)

    const equipmentsAfter = await equipmentInDb()
    const equipment = equipmentsAfter.find(e => e._id.toString() === equipments[1]._id.toString())
    expect(equipment.equipmentUnits.length).toBe(1)
    expect(equipment.equipmentUnits[0].toString()).toEqual(response.body._id)
  })

  it('does not accept an equipment unit without an asset ID', async () => {
    const equipments = await equipmentInDb()

    const newEquipmentUnit = {
      equipment: equipments[1],
      registration: '123245',
      VIN: 'abcde'
    }

    const equipmentUnitsBefore = await equipmentUnitsInDb()

    const response = await api
      .post('/api/equipmentunits')
      .set('Authorization', 'Bearer ' + token)
      .send(newEquipmentUnit)
      .expect(400)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length)
    expect(response.body).toEqual({ error: 'asset ID is missing' })
  })

  it('does not accept an equipment unit without an equipment', async () => {
    const newEquipmentUnit = {
      assetID: 'aabbcc',
      registration: '123245',
      VIN: 'abcde'
    }

    const equipmentUnitsBefore = await equipmentUnitsInDb()

    const response = await api
      .post('/api/equipmentunits')
      .set('Authorization', 'Bearer ' + token)
      .send(newEquipmentUnit)
      .expect(400)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length)
    expect(response.body).toEqual({ error: 'equipment is missing' })
  })
})

describe('PUT /api/equipmentunits/:id', () => {

  let token = null

  beforeEach(async () => {
    await initEquipmentUnits()
    token = await getToken('testadmin3')
  })

  it('updates an existing equipment unit', async () => {
    const equipmentUnitsBefore = await equipmentUnitsInDb()
    const equipment = await equipmentInDb()

    const target = equipmentUnitsBefore[1]
    target.assetID = 'xxxyyy'
    target.VIN = '9999'
    target.registration = '6666'
    target.equipment = equipment[1]

    await api
      .put(`/api/equipmentunits/${target._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    const match = equipmentUnitsAfter.find(e => e._id.toString() === target._id.toString())
    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length)
    expect(match.assetID).toEqual(target.assetID)
    expect(match.VIN).toEqual(target.VIN)
    expect(match.registration).toEqual(target.registration)
    expect(match.equipment._id.toString()).toEqual(target.equipment._id.toString())
  })

  it('prevents updating without authentication', async () => {
    const equipmentUnitsBefore = await equipmentUnitsInDb()

    const oldAssetID = equipmentUnitsBefore[1].assetID
    const target = equipmentUnitsBefore[1]
    target.assetID = 'xxxyyy'
    target.VIN = '9999'
    target.registration = '6666'

    await api
      .put(`/api/equipmentunits/${target._id}`)
      .send(target)
      .expect(403)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    const match = equipmentUnitsAfter.find(e => e._id.toString() === target._id.toString())
    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length)
    expect(match.assetID).toEqual(oldAssetID)
  })

  it('updates the parent equipments units', async () => {
    const equipments = await equipmentInDb()

    const newEquipmentUnit = {
      assetID: '6666',
      equipment: equipments[1]._id
    }

    const response = await api
      .post('/api/equipmentunits')
      .set('Authorization', 'Bearer ' + token)
      .send(newEquipmentUnit)

    const target = response.body
    target.assetID = '7777'
    target.equipment = equipments[2]._id

    await api
      .put(`/api/equipmentunits/${target._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)

    const equipmentsAfter = await equipmentInDb()
    const oldEquipment = equipmentsAfter.find(e => e._id.toString() === equipments[1]._id.toString())
    const newEquipment = equipmentsAfter.find(e => e._id.toString() === equipments[2]._id.toString())
    expect(oldEquipment.equipmentUnits).not.toContain(target._id.toString())
    expect(newEquipment.equipmentUnits.length).toBe(1)
    expect(newEquipment.equipmentUnits[0].toString()).toEqual(target._id.toString())
  })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExistingId()
    const equipmentUnitsBefore = await equipmentUnitsInDb()

    const target = equipmentUnitsBefore[1]
    target.assetID = 'xxyyyzz'

    await api
      .put(`/api/equipmentunits/${nonId}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    const assetIDs = equipmentUnitsAfter.map(e => e.assetID)
    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length)
    expect(assetIDs).not.toContain(target.assetID)
  })

  it('does not accept equipment unit without an asset ID', async () => {
    const equipmentUnitsBefore = await equipmentUnitsInDb()

    const originalTarget = equipmentUnitsBefore[1]
    const target = {
      VIN: originalTarget.VIN,
      registration: 'Changed',
      equipment: originalTarget.equipment
    }

    await api
      .put(`/api/equipmentunits/${originalTarget._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    const match = equipmentUnitsAfter.find(e => e._id.toString() === originalTarget._id.toString())
    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length)
    expect(match.registration).toEqual(originalTarget.registration)
  })

  it('does not accept equipment unit without an equipment', async () => {
    const equipmentUnitsBefore = await equipmentUnitsInDb()

    const originalTarget = equipmentUnitsBefore[1]
    const target = {
      VIN: originalTarget.VIN,
      registration: 'Changed',
      assetID: 'Changed'
    }

    await api
      .put(`/api/equipmentunits/${originalTarget._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    const match = equipmentUnitsAfter.find(e => e._id.toString() === originalTarget._id.toString())
    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length)
    expect(match.registration).toEqual(originalTarget.registration)
  })
})

describe('DELETE /api/equipmentunits/:id', () => {

  let token = null

  beforeEach(async () => {
    await initEquipmentUnits()
    token = await getToken('testadmin3')
  })

  it('deletes the correct equipment unit', async () => {
    const equipmentUnitsBefore = await equipmentUnitsInDb()

    await api
      .delete(`/api/equipmentunits/${equipmentUnitsBefore[1]._id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    const ids = equipmentUnitsAfter.map(e => e._id.toString())
    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length - 1)
    expect(ids).not.toContain(equipmentUnitsBefore[1]._id.toString())
  })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExistingId()
    const equipmentUnitsBefore = await equipmentUnitsInDb()

    await api
      .delete(`/api/equipmentunits/${nonId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)

    const equipmentUnitsAfter = await equipmentUnitsInDb()
    expect(equipmentUnitsAfter.length).toBe(equipmentUnitsBefore.length)
  })
})

afterAll(async () => {
  await server.close()
})
