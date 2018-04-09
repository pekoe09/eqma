import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from '../structure/viewHeader'
import { Form, Button, Input, Label } from 'semantic-ui-react'
import { createCustomerMessage } from '../../reducers/customerMessageReducer'

const formStyle = {
  borderRadius: 4,
  borderColor: '#d4d4d5',
  boxShadow: '0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5',
  padding: '1em'
}

const labelStyle = {
  backgroundColor: 'white'
}

class ContactForm extends React.Component {

  state = {
    name: '',
    email: '',
    message: ''
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleMessageChange = (event) => {
    this.setState({ message: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const customerMessage = {
      name: this.state.name,
      email: this.state.email,
      message: this.state.message,
      customer: this.props.user ? this.props.user._id : null
    }
    console.log('Sending ', customerMessage)
    await this.props.createCustomerMessage(customerMessage)
    this.setState({
      name: '',
      email: '',
      message: ''
    })
  }

  render() {
    return (
      <div style={formStyle}>
        <ViewHeader text='Send us a message!' />
        <Form onSubmit={this.handleSubmit}>
          <Form.Field control={Input} label='Your name' name='name'
            value={this.state.name} onChange={this.handleChange} />
          <Form.Field control={Input} label='Your email' name='email'
            value={this.state.email} onChange={this.handleChange} />
          <Form.Field>
            <Label style={labelStyle}>Your message</Label>
            <textarea value={this.state.message} onChange={this.handleMessageChange} rows={5} />
          </Form.Field>
          <Form.Field><Button primary>Send</Button></Form.Field>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (store, ownProps) => {
  const loginState = store.login
  return {
    user: loginState ? loginState.user : null
  }
}

export default withRouter(connect(
  mapStateToProps,
  { createCustomerMessage }
)(ContactForm))