const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    username: 'testuser1',
    firstName: 'Test',
    lastName: 'User1',
    password: 'test1',
    passwordHash: '$2a$10$UdYL7yoi/Fgify8nxuPuTecoT/DKB0XZJwYHTxK0vLrZOgoajFVbq',
    email: 'test1@test.com',
    status: 'user'
  },
  {
    username: 'testuser2',
    firstName: 'Test',
    lastName: 'User2',
    password: 'test2',
    passwordHash: '$2a$10$8jJZY1inPKBS28JnNp3ix.f5wBKqPB711ag1P7ktJvaygBTtIVgUO',
    email: 'test2@test.com',
    status: 'user'
  },
  {
    username: 'testadmin3',
    firstName: 'Test',
    lastName: 'Admin',
    password: 'test3',
    passwordHash: '$2a$10$jhhWHC4rpH7rl//F8aYRVuZD8w200ePLE54q39GQ7Yzc9jtbCKnaq',
    email: 'test3@test.com',
    status: 'admin'
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

const nonExistingId = async () => {
  const user = new User({
    username: 'nonuser',
    firstName: 'nonuser',
    lastName: 'nonuser',
    passwordHash: '$2y$10$PUusFleLGs1bnROiXLG9zum9I/01tcSEJWkWRDYwSUVBWRS4hLjIC',
    email: 'nonuser@not.com',
    status: 'user'
  })
  const savedUser = await user.save()
  const id = savedUser._id
  await User.findByIdAndRemove(id)
  return id
}

const getToken = async (username) => {
  const password = initialUsers.find(u => u.username === username).password
  const response = await api
    .post('/api/users/login')
    .send({
      username: username,
      password: password
    })
  return response.body.token
}

module.exports = { initialUsers, usersInDb, nonExistingId, getToken }