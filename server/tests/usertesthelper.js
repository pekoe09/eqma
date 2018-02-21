const User = require('../models/user')

const initialUsers = [
  {
    username: 'testuser1',
    firstName: 'Test',
    lastName: 'User1',
    passwordHash: '$2y$10$LDYjZts8u.zdv0ZQRvaJLeP3umuy7XFkij8hDJ6E7NmkZmNVXtCqm',
    status: 'user'
  },
  {
    username: 'testuser2',
    firstName: 'Test',
    lastName: 'User2',
    passwordHash: '$2y$10$PUusFleLGs1bnROiXLG9zum9I/01tcSEJWkWRDYwSUVBWRS4hLjIC',
    status: 'user'
  },
  {
    username: 'testadmin',
    firstName: 'Test',
    lastName: 'Admin',
    passwordHash: '$2y$10$OH9O/6ySXZCCb3fGsOgAcOaRy740Uzq35gqXLdXd2ooOo.lpp249S',
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
    status: 'user'
  })
  const savedUser = await user.save()
  const id = savedUser._id
  await User.findByIdAndRemove(id)
  return id
}

module.exports = { initialUsers, usersInDb, nonExistingId }