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

describe('POST /api/users', () => {
  beforeEach(async () => {
    await User.remove({})
    const userObjects = initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
  })

  test('adds a user', async () => {
    const newUser = {
      username: 'newuser',
      password: '12345',
      firstName: 'New',
      lastName: 'User',
      status: 'user'
    }

    const usersBefore = await usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()
    const usernames = usersAfter.map(user => user.username)

    expect(usersAfter.length).toBe(usersBefore.length + 1)
    expect(usernames).toContain(newUser.username)
  })

  test('sets status default to user', async () => {
    const newUser = {
      username: 'newuser',
      password: '12345',
      firstName: 'New',
      lastName: 'User'
    }

    const response = await api
      .post('/api/users')
      .send(newUser)

    const usersAfter = await usersInDb()
    const match = usersAfter.find(u => u.id.toString() === response.body._id)

    expect(match.status).toEqual('user')
  })

  test('does not accept user without a username', async () => {
    const newUser = {
      password: '12345',
      firstName: 'New',
      lastName: 'User'
    }

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(response.body).toEqual({ error: 'username is missing' })
  })

  test('does not accept user with an empty string as the username', async () => {
    const newUser = {
      username: '',
      password: '12345',
      firstName: 'New',
      lastName: 'User'
    }

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(response.body).toEqual({ error: 'username is missing' })
  })

  test('does not accept user with an existing username', async () => {
    const newUser = {
      username: initialUsers[1].username,
      password: '12345',
      firstName: 'New',
      lastName: 'User'
    }

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(response.body).toEqual({ error: 'username is already in use' })
  })

  test('does not accept user without a password', async () => {
    const newUser = {
      username: 'newuser',
      firstName: 'New',
      lastName: 'User'
    }

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(response.body).toEqual({ error: 'password is missing' })
  })

  test('does not accept user with an empty string as the password', async () => {
    const newUser = {
      username: 'newuser',
      password: '',
      firstName: 'New',
      lastName: 'User'
    }

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(response.body).toEqual({ error: 'password is missing' })
  })
})

describe('PUT /api/users/:id', () => {
  beforeEach(async () => {
    await User.remove({})
    const userObjects = initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
  })

  it('updates an existing user', async () => {
    const usersBefore = await usersInDb()

    const target = usersBefore[1]
    target.username = 'UpdatedUsername',
    target.firstName = 'New first',
    target.lastName = 'New last',
    target.status = 'newstatus'
    console.log('Sending ', target)

    await api
      .put(`/api/users/${target._id}`)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()
    const match = usersAfter.find(u => u._id.toString() === target._id.toString())
    console.log('Matching: ', match)
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(match).toEqual(target)
  })

  it('returns error for nonexisting id', async () => {

  })

  it('does not accept user without a username', async () => {

  })

  it('does not accept user with an empty string as a username', async () => {

  })

  it('does not accept user with an existing username', async () => {

  })
})

afterAll(async () => {
  await server.close()
  console.log('user test server closed')
})