const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { initialUsers, usersInDb } = require('./usertesthelper')

describe('GET /api/users', () => {
  beforeAll(async () => {
    await User.remove({})
    const userObjects = initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
  })

  it('works', async () => {
    await api
      .get('/api/users')
      .expect(200)
  })

  it('returns users as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the correct number of users', async () => {
    const response = await api
      .get('/api/users')

    expect(response.body.length).toBe(initialUsers.length)
  })

  it('returns all users', async () => {
    const response = await api
      .get('/api/users')

    const usernames = response.body.map(user => user.username)
    initialUsers.forEach(user => expect(usernames).toContain(user.username))
  })
})

afterAll(() => {
  server.close()
})