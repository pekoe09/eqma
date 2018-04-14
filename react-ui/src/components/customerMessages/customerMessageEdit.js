import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button, Label } from 'semantic-ui-react'
import moment from 'moment'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { updateCustomerMessage } from '../../reducers/customerMessageReducer'

const formStyle = {
  marginTop: 10
}

const labelStyle = {
  backgroundColor: 'white',
  fontSize: '.928571em',
  fontWeight: '700',
  paddingLeft: 0,
  color: 'rgba(0,0,0,.87)'
}

class CustomerMessageEdit extends React.Component {
  state = {
    handler: this.props.initialMessage.handler
      ? this.props.initialMessage.handler
      : this.props.user,
    reply: this.props.initialMessage.reply
  }

  handleChange = (event) => {
    this.setState({ reply: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    let customerMessage = this.props.initialMessage
    customerMessage.reply = this.state.reply
    customerMessage.handler = this.state.handler
    customerMessage.handlerName = `${customerMessage.handler.firstName} ${customerMessage.handler.lastName}`
    console.log('Replyint to message', customerMessage)
    await this.props.updateCustomerMessage(customerMessage)
    this.props.history.push('/customermessages')
  }

  replyLabel = () => {
    if (this.props.initialMessage.replySent) {
      return (
        <span>Our reply (sent {moment(this.props.initialMessage.replySent).format('MM/DD/YYYY HH:mm')})</span>
      )
    } else {
      return <span>Our reply</span>
    }
  }

  render() {
    return (
      <div>
        <ViewHeader text={`Customer message from ${this.props.initialMessage.name}`} />
        <LinkButton text={'Back to message list'} to={'/customermessages'} type={'default'} />
        <Form style={formStyle} onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Customer name</label>
            <p>{this.props.initialMessage.name}</p>
          </Form.Field>
          <Form.Field>
            <label>Customer email</label>
            <p>{this.props.initialMessage.email}</p>
          </Form.Field>
          <Form.Field>
            <label>Message sent</label>
            <p>{moment(this.props.initialMessage.sent).format('MM/DD/YYYY HH:mm')}</p>
          </Form.Field>
          <Form.Field>
            <label>Message</label>
            <p>{this.props.initialMessage.message}</p>
          </Form.Field>
          <Form.Field>
            <label>Handler</label>
            <p>{`${this.state.handler.firstName} ${this.state.handler.lastName}`}</p>
          </Form.Field>
          <Form.Field>
            <Label style={labelStyle}>{this.replyLabel()}</Label>
            <textarea value={this.state.reply} onChange={this.handleChange} rows={5} />
          </Form.Field>
          <Form.Field>
            <Button primary>Send reply</Button>
          </Form.Field>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (store, ownProps) => {
  const initialMessage = store.customerMessages.find(m => m._id === ownProps.match.params.id)
  return {
    initialMessage,
    user: store.login.user
  }
}

export default withRouter(connect(
  mapStateToProps,
  { updateCustomerMessage }
)(CustomerMessageEdit))