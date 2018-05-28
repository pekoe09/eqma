import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from '../structure/viewHeader'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { Form, Button } from 'semantic-ui-react'
import rentalService from '../../services/rentals'
import { addUIMessage } from '../../reducers/uiMessageReducer'

const formStyle = {
  borderRadius: 4,
  borderColor: '#d4d4d5',
  boxShadow: '0 1px 3px 0 #d4d4d5, 0 0 0 1px #d4d4d5',
  padding: '1em'
}

class RentalReservationForm extends React.Component {

  state = {
    start: moment(),
    end: moment().add(1, 'day')
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const rentalReservation = {
      userToken: this.props.user.token,
      equipment: this.props.equipmentID,
      start: this.state.start,
      end: this.state.end,
      price: this.props.price,
      timeUnit: this.props.timeUnit
    }
    const result = await rentalService.createReservation(rentalReservation)
    if (result) {
      this.props.addUIMessage(
        `${this.props.makeAndModel} has been reserved for you from ${moment(this.state.start).format('MM/DD/YYYY')} until ${moment(this.state.end).format('MM/DD/YYYY')}`,
        'success',
        10
      )
      this.props.history.push('/equipment/forrent')
    } else {
      this.props.addUIMessage(`Reservation failed: ${this.props.makeAndModel} is not available for the period requested`, 'error', 10)
    }
  }

  render() {
    return (
      <div style={formStyle}>
        <ViewHeader text='Reserve for rent!' />
        <Form onSubmit={this.handleSubmit}>
          <Form.Field width={4}>
            <label forname='start'>Date</label>
            <DatePicker
              name='start'
              selected={this.state.start}
              onChange={this.handleStartChange}
              todayButton={'Today'}
            />
          </Form.Field>
          <Form.Field width={4}>
            <label forname='end'>Date</label>
            <DatePicker
              name='end'
              selected={this.state.end}
              onChange={this.handleEndChange}
              todayButton={'Today'}
            />
          </Form.Field>
          <Form.Field><Button primary>Make reservation</Button></Form.Field>
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
  {
    addUIMessage
  }
)(RentalReservationForm))

