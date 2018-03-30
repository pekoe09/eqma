import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button } from 'semantic-ui-react'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'
import { createUser } from '../reducers/userReducer'

const statusOptions = [
  { key: 'user', text: 'User', value: 'user' },
  { key: 'admin', text: 'Admin', value: 'admin' },
]

const formStyle = {
  marginTop: 10
}

class UserCreate extends React.Component {
  state = {
    username: '',
    password: '',
    confirmPsw: '',
    firstName: '',
    lastName: '',
    email: '',
    status: ''
  }

  handleChange = (event, { value }) => {
    if (event.target.name) {
      this.setState({ [event.target.name]: value })
    } else {
      this.setState({ status: value })
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const user = {
      username: this.state.username,
      password: this.state.password,
      confirmPsw: this.state.confirmPsw,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      status: this.state.status
    }
    this.props.createUser(user)
    this.props.history.push('/users')
  }

  render() {
    return (
      <div>
        <ViewHeader text={'Add a user'} />
        <LinkButton text={'Cancel'} to={'/users'} type={'default'} />
        <Form style={formStyle} onSubmit={this.handleSubmit}>
          <Form.Field required control={Input} width={6} label='Username' name='username'
            value={this.state.username} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='Password' name='password'
            value={this.state.password} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='Confirm password' name='confirmPsw'
            value={this.state.confirmPsw} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='First name' name='firstName'
            value={this.state.firstName} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='Last name' name='lastName'
            value={this.state.lastName} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='Email' name='email'
            value={this.state.email} onChange={this.handleChange} />
          <Form.Field required control={Select} width={6} label='Status' name='status'
            options={statusOptions} value={this.state.status} onChange={this.handleChange} />
          <Form.Field>
            <Button primary>
              Save
            </Button>
          </Form.Field>
        </Form>
      </div>
    )
  }
}

export default withRouter(connect(
  null,
  { createUser }
)(UserCreate))