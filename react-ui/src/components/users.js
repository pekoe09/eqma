import React from 'react'
import User from './user'

const Users = ({ users }) => (
  <div>
    <h2>User list</h2>
    <table>
      <thead>
        <tr>
          <th>Username</th>
          <th>First name</th>
          <th>Last name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => <User key={user.username} user={user} />)}
      </tbody>
    </table>
  </div>
)

export default Users