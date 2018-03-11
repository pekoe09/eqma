import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button } from 'semantic-ui-react'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'
import { updateCustomer } from '../reducers/customerReducer'

const formStyle = {
  marginTop: 10
}

class CustomerEdit extends React.Component {
  state = {
    lastName: this.props.initialCustomer.lastName,
    firstNames: this.props.initialCustomer.firstNames,
    company: this.props.initialCustomer.company,
    email: this.props.initialCustomer.email,
    phone: this.props.initialCustomer.phone,
    street1: this.props.initialCustomer.billingAddress.street1,
    street2: this.props.initialCustomer.billingAddress.street2,
    zip: this.props.initialCustomer.billingAddress.zip,
    city: this.props.initialCustomer.billingAddress.city,
    country: this.props.initialCustomer.billingAddress.country,
    isInvoicable: false
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    let customer = this.props.initialCustomer
    customer.lastName = this.state.lastName
    customer.firstNames = this.state.firstNames
    customer.company = this.state.company
    customer.email = this.state.email
    customer.phone = this.state.phone
    customer.billingAddress.street1 = this.state.street1
    customer.billingAddress.street2 = this.state.street2
    customer.billingAddress.zip = this.state.zip
    customer.billingAddress.city = this.state.city
    customer.billingAddress.country = this.state.country
    await this.props.updateCustomer(customer)
    this.props.history.push('/customers')
  }

  render() {
    return (
      <div>
        <ViewHeader text={`Edit customer ${this.props.initialCustomer.displayName}`} />
        <LinkButton text={'Cancel'} to={'/customers'} type={'default'} />
        <Form style={formStyle} onSubmit={this.handleSubmit}>
          <Form.Field required control={Input} width={6} label='Last name' name='lastName'
            value={this.state.lastName} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='First names' name='firstNames'
            value={this.state.firstNames} onChange={this.handleChange} />
          <Form.Field control={Input} width={6} label='Company' name='company'
            value={this.state.company} onChange={this.handleChange} />
          <Form.Field control={Input} width={6} label='Email' name='email'
            value={this.state.email} onChange={this.handleChange} />
          <Form.Field control={Input} width={6} label='Phone' name='phone'
            value={this.state.phone} onChange={this.handleChange} />
          <h4>Billing address</h4>
          <Form.Field required control={Input} width={6} label='Street address 1' name='street1'
            value={this.state.street1} onChange={this.handleChange} />
          <Form.Field control={Input} width={6} label='Street address 2' name='street2'
            value={this.state.street2} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='ZIP code' name='zip'
            value={this.state.zip} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='City' name='city'
            value={this.state.city} onChange={this.handleChange} />
          <Form.Field required control={Input} width={6} label='Country' name='country'
            value={this.state.country} onChange={this.handleChange} />
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
  const initialCustomer = store.customers.find(c => c._id === ownProps.match.params.id)
  return {
    initialCustomer
  }
}

export default withRouter(connect(
  mapStateToProps,
  { updateCustomer }
)(CustomerEdit))