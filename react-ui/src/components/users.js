import React from 'react'
import User from './user'
import { connect } from 'react-redux'

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

const mapStateToProps = (store) => {
  return {
    users: store.users
  }
}

export default connect(
  mapStateToProps
)(Users)