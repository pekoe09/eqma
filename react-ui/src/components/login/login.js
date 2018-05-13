import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button } from 'semantic-ui-react'
import { login } from '../../reducers/loginReducer'
import { initializeUsers } from '../../reducers/userReducer'
import { initializeAssetTransactions } from '../../reducers/assetTransactionReducer'
import { initializeCustomers } from '../../reducers/customerReducer'
import { initializeCustomerMessages } from '../../reducers/customerMessageReducer'
import { initializeEquipment } from '../../reducers/equipmentReducer'
import { initializeEquipmentTypes } from '../../reducers/equipmentTypeReducer'
import { initializeEquipmentUnits } from '../../reducers/equipmentUnitReducer'
import { initializeRentals } from '../../reducers/rentalReducer'

const loginInputStyle = {
  maxWidth: 100
}

const loginLabelStyle = {
  fontWeight: 400
}

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
    const credentials = {
      username: this.state.username,
      password: this.state.password
    }
    this.setState({
      username: '',
      password: ''
    })
    await this.props.login(credentials)

    this.props.initializeUsers()
    this.props.initializeEquipmentTypes()
    this.props.initializeEquipment()
    this.props.initializeEquipmentUnits()
    this.props.initializeAssetTransactions()
    this.props.initializeCustomers()
    this.props.initializeCustomerMessages()
    this.props.initializeRentals()
  }

  render() {
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group inline>
            <Form.Input inline label='username' name='username' size='mini' style={loginInputStyle}
              value={this.state.username} onChange={this.handleChange} />
            <Form.Input inline label='password' name='password' type='password' size='mini' style={loginInputStyle}
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
  {
    login,
    initializeAssetTransactions,
    initializeCustomers,
    initializeCustomerMessages,
    initializeEquipment,
    initializeEquipmentTypes,
    initializeEquipmentUnits,
    initializeRentals,
    initializeUsers
  }
)(Login))