const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { getToken } = require('./usertesthelper')
const CustomerMessage = require('../models/customerMessage')
const {
  initialCustomerMessages,
  initCustomerMessages,
  customerMessagesInDb,
  nonExisitingId
} = require('./customermessagestesthelper')

describe('GET /api/customermessages', () => {

  let token = null

  beforeAll(async () => {
    await initCustomerMessages()
    token = await getToken('testadmin3')
  })

  it('works', async () => {
    await api
      .get('/api/customermessages')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('prevents access without authentication', async () => {
    await api
      .get('/Api/customermessages')
      .expect(403)
  })

  it('returns customer messages as json', async () => {
    await api
      .get('/api/customermessages')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the correct number of customer messages', async () => {
    const response = await api
      .get('/api/customermessages')
      .set('Authorization', 'Bearer ' + token)

    expect(response.body.length).toBe(initialCustomerMessages.length)
  })

  it('returns all customer messages', async () => {
    const response = await api
      .get('/api/customermessages')
      .set('Authorization', 'Bearer ' + token)

    const msgContents = response.body.map(m => m.message)
    initialCustomerMessages.forEach(m => expect(msgContents).toContain(m.message))
  })

})

afterAll(async () => {
  await server.close()
})