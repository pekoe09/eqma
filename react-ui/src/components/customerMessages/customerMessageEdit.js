import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button, Label, Confirm } from 'semantic-ui-react'
import moment from 'moment'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { updateCustomerMessage, removeCustomerMessage } from '../../reducers/customerMessageReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

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
    reply: this.props.initialMessage.reply,
    openDeleteConfirm: false
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
    await this.props.updateCustomerMessage(customerMessage)
    this.props.history.push('/customermessages')
  }

  handleRemove = async () => {
    this.setState({ openDeleteConfirm: true })
  }

  handleConfirmedRemove = async () => {
    const name = this.props.initialMessage.name
    await this.props.removeCustomerMessage(this.props.initialMessage._id)
    this.props.addUIMessage(`Message from user ${name} deleted`, 'success', 10)
    this.props.history.push('/customermessages')
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false })
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
    if (this.props.initialMessage) {
      return (
        <div>
          <ViewHeader text={`Customer message from ${this.props.initialMessage.name}`} />
          <LinkButton text='Back to message list' to='/customermessages' type='default' />
          <Button negative onClick={this.handleRemove}>Delete</Button>
          <Confirm
            open={this.state.openDeleteConfirm}
            header='Deleting a customer message'
            content={`Deleting message from ${this.props.initialMessage.name}. The operation is permanent; are you sure?`}
            confirmButton='Yes, delete'
            onConfirm={this.handleConfirmedRemove}
            onCancel={this.handleCancelledRemove}
          />
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
    } else {
      return <div></div>
    }
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
  {
    updateCustomerMessage,
    removeCustomerMessage,
    addUIMessage
  }
)(CustomerMessageEdit))