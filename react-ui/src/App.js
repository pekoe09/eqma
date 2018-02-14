import React from 'react'
import userService from './services/users'
import Users from './components/users'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      users: []
    }
  }

  componentWillMount() {
    userService
      .getAll()
      .then(response => {
        this.setState({ users: response })
      })
  }

  render() {
    console.log(this.state.users)
    const users = this.state.users.map(u => <div>{u.username} {u.lastName}, {u.firstName}</div>)

    return (
      <div>
        <Users users={this.state.users} />
      </div>
    )
  }

}

export default App
