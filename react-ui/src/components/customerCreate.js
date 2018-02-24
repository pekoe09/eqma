import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select, Button } from 'semantic-ui-react'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'
import { createCustomer } from '../reducers/customerReducer'

const formStyle = {
  marginTop: 10
}

class CustomerCreate extends React.Component {
  state = {
    lastName: '',
    firstNames: '',
    company: '',
    email: '',
    phone: '',
    street1: '',
    street2: '',
    zip: '',
    city: '',
    country: '',
    isInvoicable: false
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const customer = {
      lastName: this.state.lastName,
      firstNames: this.state.firstNames,
      company: this.state.company,
      email: this.state.email,
      phone: this.state.phone,
      billingAddress: {
        street1: this.state.street1,
        street2: this.state.street2,
        zip: this.state.zip,
        city: this.state.city,
        country: this.state.country
      },
      isInvoicable: this.state.isInvoicable
    }
    this.props.createCustomer(customer)
    this.props.history.push('/customers')
  }

  render() {
    return (
      <div>
        <ViewHeader text={'Add a customer'} />
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
      </div >
    )
  }
}

export default connect(
  null,
  { createCustomer }
)(CustomerCreate)