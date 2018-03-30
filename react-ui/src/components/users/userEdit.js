import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button } from 'semantic-ui-react'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { updatedUser } from '../../reducers/userReducer'

const statusOptions = [
  { key: 'user', text: 'User', value: 'user' },
  { key: 'admin', text: 'Admin', value: 'admin' },
]

const formStyle = {
  marginTop: 10
}

class UserEdit extends React.Component {
  state = {
    username: this.props.initialUser.username,
    firstName: this.props.initialUser.firstName,
    lastName: this.props.initialUser.lastName,
    email: this.props.initialUser.email,
    status: this.props.initialUser.status
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
    let user = this.props.initialUser
    user.username = this.state.username
    user.firstName = this.state.firstName
    user.lastName = this.state.lastName
    user.email = this.state.email
    user.status = this.state.status
    await this.props.updatedUser(user)
    this.props.history.push('/users')
  }

  render() {
    return (
      <div>
        <ViewHeader text={`Edit user ${this.props.initialUser.firstName} ${this.props.initialUser.lastName}`} />
        <LinkButton text={'Cancel'} to={'/users'} type={'default'} />
        <Form style={formStyle} onSubmit={this.handleSubmit}>
          <Form.Field required control={Input} width={6} label='Username' name='username'
            value={this.state.username} onChange={this.handleChange} />
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

const mapStateToProps = (store, ownProps) => {
  const initialUser = store.users.find(u => u._id === ownProps.match.params.id)
  return {
    initialUser
  }
}

export default withRouter(connect(
  mapStateToProps,
  { updatedUser }
)(UserEdit))