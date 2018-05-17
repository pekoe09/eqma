const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { initialUsers, usersInDb, nonExistingId, getToken } = require('./usertesthelper')

describe.skip('GET /api/users', () => {

  let token = null

  beforeAll(async () => {
    await User.remove({})
    const userObjects = initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
    token = await getToken('testadmin3')
  })

  it('works', async () => {
    await api
      .get('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('returns users as json', async () => {
    await api
      .get('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the correct number of users', async () => {
    const response = await api
      .get('/api/users')
      .set('Authorization', 'Bearer ' + token)

    expect(response.body.length).toBe(initialUsers.length)
  })

  it('returns all users', async () => {
    const response = await api
      .get('/api/users')
      .set('Authorization', 'Bearer ' + token)

    const usernames = response.body.map(user => user.username)
    initialUsers.forEach(user => expect(usernames).toContain(user.username))
  })
})

describe('POST /api/users', () => {

  let token = null

  beforeEach(async () => {
    await User.remove({})
    const userObjects = initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
    token = await getToken('testadmin3')
  })

  test('adds a user', async () => {
    const newUser = {
      username: 'newuser',
      password: '12345',
      firstName: 'New',
      lastName: 'User',
      email: 'new.user@test.com',
      status: 'user'
    }

    const usersBefore = await usersInDb()

    await api
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
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
      lastName: 'User',
      email: 'new.user@test.com'
    }

    const response = await api
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .send(newUser)

    const usersAfter = await usersInDb()
    const match = usersAfter.find(u => u.id.toString() === response.body._id)

    expect(match.status).toEqual('user')
  })

  test('does not accept user without a username', async () => {
    const newUser = {
      password: '12345',
      firstName: 'New',
      lastName: 'User',
      email: 'new.user@test.com'
    }

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
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
      lastName: 'User',
      email: 'new.user@test.com'
    }

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
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
      lastName: 'User',
      email: 'new.user@test.com'
    }

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
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
      lastName: 'User',
      email: 'new.user@test.com'
    }

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
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
      lastName: 'User',
      email: 'new.user@test.com'
    }

    const usersBefore = await usersInDb()

    const response = await api
      .post('/api/users')
      .set('Authorization', 'Bearer ' + token)
      .send(newUser)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(response.body).toEqual({ error: 'password is missing' })
  })
})

describe('PUT /api/users/:id', () => {

  let token = null

  beforeEach(async () => {
    await User.remove({})
    const userObjects = initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
    token = await getToken('testadmin3')
  })

  it('updates an existing user', async () => {
    const usersBefore = await usersInDb()

    const target = usersBefore[1]
    target.username = 'UpdatedUsername'
    target.firstName = 'New first'
    target.lastName = 'New last'
    target.status = 'newstatus'
    target.email = 'updated.user@test.com'

    await api
      .put(`/api/users/${target._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()
    const match = usersAfter.find(u => u._id.toString() === target._id.toString())
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(match.toJSON()).toEqual(target.toJSON())
  })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExistingId()
    const usersBefore = await usersInDb()

    const target = usersBefore[1]
    target.username = 'anothername'

    await api
      .put(`/api/users/${nonId}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const usersAfter = await usersInDb()
    const usernames = usersAfter.map(user => user.username)
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(usernames).not.toContain(target.username)
  })

  it('does not accept user without a username', async () => {
    const usersBefore = await usersInDb()

    const originalTarget = usersBefore[1]
    const target = {
      firstName: 'New first',
      lastName: 'New last',
      status: 'newstatus',
      email: 'new.user@test.com'
    }

    await api
      .put(`/api/users/${originalTarget._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const usersAfter = await usersInDb()
    const match = usersAfter.find(u => u._id.toString() === originalTarget._id.toString())
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(match.toJSON()).toEqual(originalTarget.toJSON())
  })

  it('does not accept user with an empty string as a username', async () => {
    const usersBefore = await usersInDb()

    const originalTarget = usersBefore[1]
    const target = {
      username: '',
      firstName: 'New first',
      lastName: 'New last',
      status: 'newstatus',
      email: 'new.user@test.com'
    }

    await api
      .put(`/api/users/${originalTarget._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const usersAfter = await usersInDb()
    const match = usersAfter.find(u => u._id.toString() === originalTarget._id.toString())
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(match.toJSON()).toEqual(originalTarget.toJSON())
  })

  it('does not accept user with an existing username', async () => {
    const usersBefore = await usersInDb()

    const originalTarget = usersBefore[1]
    const target = {
      username: usersBefore[0].username,
      firstName: 'New first',
      lastName: 'New last',
      status: 'newstatus',
      email: 'new.user@test.com'
    }

    await api
      .put(`/api/users/${originalTarget._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const usersAfter = await usersInDb()
    const match = usersAfter.find(u => u._id.toString() === originalTarget._id.toString())
    expect(usersAfter.length).toBe(usersBefore.length)
    expect(match.toJSON()).toEqual(originalTarget.toJSON())
  })
})

describe('DELETE /api/users/:id', () => {

  let token = null

  beforeAll(async () => {
    token = await getToken('testadmin3')
  })

  // it('deletes the correct user', async () => {
  //   const usersBefore = await usersInDb()

  //   await api
  //     .delete(`/api/users/${usersBefore[1]._id}`)
  //     .set('Authorization', 'Bearer ' + token)
  //     .expect(204)

  //   const usersAfter = await usersInDb()
  //   const ids = usersAfter.map(u => u._id.toString())
  //   expect(usersAfter.length).toBe(usersBefore.length - 1)
  //   expect(ids).not.toContain(usersBefore[1]._id.toString())
  // })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExistingId()
    const usersBefore = await usersInDb()

    await api
      .delete(`/api/users/${nonId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
  })
})

afterAll(async () => {
  await server.close()
})