import React from 'react'
import { Container } from 'semantic-ui-react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { initializeUsers } from './reducers/userReducer'
import NavBar from './components/structure/navbar'
import Users from './components/users'
import UserCreate from './components/userCreate'

class App extends React.Component {

  componentDidMount = async () => {
    this.props.initializeUsers()
  }

  render() {
    return (
      <Container>
        <NavBar />
        <Route exact path='/users' render={() => <Users />} />
        <Route exact path='/users/create' render={({ history }) =>
          <UserCreate history={history} />}
        />
      </Container>
    )
  }
}

export default withRouter(connect(
  null,
  { initializeUsers }
)(App))
