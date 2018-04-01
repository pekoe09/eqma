import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button } from 'semantic-ui-react'
import { login } from '../../reducers/loginReducer'

class Login extends React.Component {
  state = {
    username: '',
    password: ''
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    console.log('Logging in with ', this.state.username, ' ', this.state.password)
    this.props.login({
      username: this.state.username,
      password: this.state.password
    })
    this.setState({
      username: '',
      password: ''
    })
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group inline>
            <Form.Input inline label='username' name='username' size='mini'
              value={this.state.username} onChange={this.handleChange} />
            <Form.Input inline label='password' name='password' type='password' size='mini'
              value={this.state.password} onChange={this.handleChange} />
            <Form.Field>
              <Button primary size='mini'>login</Button>
            </Form.Field>
          </Form.Group>
        </Form>
      </div>
    )
  }
}

export default withRouter(connect(
  null,
  { login }
)(Login))