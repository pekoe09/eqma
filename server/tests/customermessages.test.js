const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { getToken } = require('./usertesthelper')
const CustomerMessage = require('../models/customerMessage')
const Customer = require('../models/customer')
const User = require('../models/user')
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

  it('returns messages populated with customer and handler details', async () => {
    const response = await api
      .get('/api/customermessages')
      .set('Authorization', 'Bearer ' + token)

    const customers = await Customer.find({})
    const users = await User.find({})
    expect(response.body[1].customer.displayName).toEqual(customers[1].displayName)
    expect(response.body[1].handler.username).toEqual(users[1].username)
  })

})

describe('POST /api/customermessages', async () => {

  let token = null

  beforeEach(async () => {
    await initCustomerMessages()
    token = await getToken('testadmin3')
  })

  it('adds a customer message', async () => {
    const newMessage = {
      email: 'newmail@nowhere.com',
      name: 'new sender',
      message: 'new message'
    }

    const messagesBefore = await customerMessagesInDb()

    await api
      .post('/api/customermessages')
      .send(newMessage)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const messagesAfter = await customerMessagesInDb()
    const messageContents = messagesAfter.map(m => m.message)
    expect(messagesAfter.length).toBe(messagesBefore.length + 1)
    expect(messageContents).toContain(newMessage.message)
  })

  it('does not accept a message without name', async () => {
    const newMessage = {
      email: 'newmail@nowhere.com',
      name: '',
      message: 'new message'
    }

    const messagesBefore = await customerMessagesInDb()

    const response = await api
      .post('/api/customermessages')
      .send(newMessage)
      .expect(400)

    const messagesAfter = await customerMessagesInDb()
    expect(messagesAfter.length).toBe(messagesBefore.length)
    expect(response.body).toEqual({ error: 'name is missing' })
  })

  it('does not accept a message without an email', async () => {
    const newMessage = {
      email: '',
      name: 'new sender',
      message: 'new message'
    }

    const messagesBefore = await customerMessagesInDb()

    const response = await api
      .post('/api/customermessages')
      .send(newMessage)
      .expect(400)

    const messagesAfter = await customerMessagesInDb()
    expect(messagesAfter.length).toBe(messagesBefore.length)
    expect(response.body).toEqual({ error: 'email is missing' })
  })

  it('populates sent field automatically', async () => {
    const newMessage = {
      email: 'newmail@nowhere.com',
      name: 'new sender',
      message: 'new message'
    }
    const start = new Date()

    const response = await api
      .post('/api/customermessages')
      .send(newMessage)
      .expect(201)

    const savedMessage = await CustomerMessage.findById(response.body._id)
    const end = new Date()
    expect(Date.parse(response.body.sent)).toBeGreaterThanOrEqual(Date.parse(start))
    expect(Date.parse(response.body.sent)).toBeLessThanOrEqual(Date.parse(end) + 5000)
    expect(Math.floor(Date.parse(savedMessage.sent) / 10000)).toEqual(Math.floor(Date.parse(response.body.sent) / 10000))
  })

})

describe('PUT /api/customermessages/:id', async () => {

  let token = null

  beforeEach(async () => {
    await initCustomerMessages()
    token = await getToken('testadmin3')
  })

  it('updates an existing customer message', async () => {
    const messagesBefore = await customerMessagesInDb()

    const target = messagesBefore[1]
    target.reply = 'snazzy reply'

    await api
      .put(`/api/customermessages/${target._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const messagesAfter = await customerMessagesInDb()
    const match = messagesAfter.find(m => m._id.toString() === target._id.toString())
    expect(match.reply).toEqual(target.reply)
  })

  it('populates replySent field automatically', async () => {
    const messagesBefore = await customerMessagesInDb()

    const target = messagesBefore[1]
    target.reply = 'snazzy reply'
    const start = new Date()

    const response = await api
      .put(`/api/customermessages/${target._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const end = new Date()
    const messagesAfter = await customerMessagesInDb()
    const savedMessage = messagesAfter.find(m => m._id.toString() === target._id.toString())
    expect(Date.parse(response.body.replySent)).toBeGreaterThanOrEqual(Date.parse(start))
    expect(Date.parse(response.body.replySent)).toBeLessThanOrEqual(Date.parse(end) + 5000)
    expect(Math.floor(Date.parse(savedMessage.replySent) / 10000)).toEqual(Math.floor(Date.parse(response.body.replySent) / 10000))
  })

  it('prevents updating a customer message without authentication', async () => {
    const messagesBefore = await customerMessagesInDb()

    const target = messagesBefore[1]
    target.reply = 'Snazzy reply'

    await api
      .put(`/api/customermessages/${target._id}`)
      .send(target)
      .expect(403)

    const messagesAfter = await customerMessagesInDb()
    const replies = messagesAfter.map(m => m.reply)
    expect(messagesAfter.length).toBe(messagesBefore.length)
    expect(replies).not.toContain(target.reply)
  })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExisitingId()
    const messagesBefore = await customerMessagesInDb()

    const target = messagesBefore[1]
    target.reply = 'snazzy reply'

    await api
      .put(`/api/customermessages/${nonId}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const messagesAfter = await customerMessagesInDb()
    const replies = messagesAfter.map(m => m.reply)
    expect(messagesAfter.length).toBe(messagesBefore.length)
    expect(replies).not.toContain(target.reply)
  })

  it('removes a handler if drop flag on', async () => {
    const messagesBefore = await customerMessagesInDb()

    const originalMessage = messagesBefore[1]
    const target = { handlerDropped: 'true' }

    console.log('Updating', target)
    const response = await api
      .put(`/api/customermessages/${originalMessage._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const messagesAfter = await customerMessagesInDb()
    const savedMessage = messagesAfter.find(m => m._id.toString() === originalMessage._id.toString())
    expect(response.body.handler).toBeNull()
    expect(savedMessage.handler).toBeNull()
  })

  it('adds a handler if none exists and drop flag is not on', async () => {
    let messagesBefore = await customerMessagesInDb()
    const originalMessage = messagesBefore[1]
    const strippedMessage = {
      _id: originalMessage._id,
      customer: originalMessage.customer,
      email: originalMessage.email,
      name: originalMessage.name,
      message: originalMessage.message,
      sent: originalMessage.sent,
      handler: null
    }
    await CustomerMessage.findByIdAndUpdate(strippedMessage._id, strippedMessage)
    messagesBefore = await customerMessagesInDb()
    const messageBefore = messagesBefore.find(m => m._id.toString() === strippedMessage._id.toString())
    expect(messageBefore.handler).toBeNull()

    const target = {}
    const response = await api
      .put(`/api/customermessages/${strippedMessage._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const messagesAfter = await customerMessagesInDb()
    const savedMessage = messagesAfter.find(m => m._id.toString() === strippedMessage._id.toString())
    expect(response.body.handler.username).toEqual('testadmin3')
    expect(savedMessage.handler.username).toEqual('testadmin3')
  })

})

afterAll(async () => {
  await server.close()
})