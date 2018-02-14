import React from 'react'

const User = ({ user }) => (
  <tr>
    <td>{user.username}</td>
    <td>{user.firstName}</td>
    <td>{user.lastName}</td>
    <td>{user.status}</td>
  </tr>
)

export default User