const User = require('../models/user')

const initialUsers = [
  {
    username: 'testuser1',
    firstname: 'Test',
    lastname: 'User1',
    password: 'testpass1',
    status: 'user'
  },
  {
    username: 'testuser2',
    firstname: 'Test',
    lastname: 'User2',
    password: 'testpass2',
  },
  {
    username: 'testadmin',
    firstname: 'Test',
    lastname: 'Admin',
    password: 'testpass3',
    status: 'admin'
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users
}

module.exports = { initialUsers, usersInDb }