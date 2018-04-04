import React from 'react'
import ViewHeader from '../structure/viewHeader'
import { Form, Button, Input, TextArea, Label } from 'semantic-ui-react'

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

  render() {
    return (
      <div style={formStyle}>
        <ViewHeader text='Send us a message!' />
        <Form>
          <Form.Field control={Input} label='Your name' name='name'
            value={this.state.name} onChange={this.handleChange} />
          <Form.Field control={Input} label='Your email' name='email'
            value={this.state.email} onChange={this.handleChange} />
          <Form.Field>
            <Label style={labelStyle}>Your message</Label>
            <TextArea value={this.state.message} onChange={this.handleChange} rows={5}/>
          </Form.Field>
          <Form.Field><Button primary>Send</Button></Form.Field>
        </Form>
      </div>
    )
  }
}

export default ContactForm