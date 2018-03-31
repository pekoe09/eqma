import React from 'react'
import { Form, Input, Button } from 'semantic-ui-react'
import { login } from '../../services/login'

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    error: ''
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {    
    event.preventDefault()
    console.log('Logging in with ', this.state.username, ' ', this.state.password)
    try {
      const user = await login({
        username: this.state.username,
        password: this.state.password
      })
      window.localStorage.setItem('user', JSON.stringify(user))
      this.setState({
        username: '',
        password: '',
        error: ''
      })
    }
    catch (exception) {
      this.setState({
        error: 'invalid username or password'
      })
    }
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

export default Login