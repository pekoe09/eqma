import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import { Form, Input, Select, Button } from 'semantic-ui-react'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { createRental } from '../../reducers/rentalReducer'

const timeUnitOptions = [
  { key: 'day', text: 'Day', value: 'day' },
  { key: 'week', text: 'Week', value: 'week' },
  { key: 'month', text: 'Month', value: 'month' },
  { key: 'year', text: 'Year', value: 'year' },
  { key: 'minute', text: 'Minute', value: 'minute' },
  { key: 'hour', text: 'Hour', value: 'hour' },
]

const formStyle = {
  marginTop: 10
}

class RentalCreate extends React.Component {
  state = {
    equipmentUnit: '',
    customer: '',
    start: moment(),
    end: null,
    timeUnit: '',
    price: ''
  }

  handleChange = (event, { value }) => {
    if (event.target.name) {
      this.setState({ [event.target.name]: value })
    } else {
      this.setState({ timeUnit: value })
    }
  }

  handleStartChange = (start) => {
    this.setState({ start })
  }

  handleEndChange = (end) => {
    this.setState({ end })
  }

  handleEquipmentUnitChange = (event, { value }) => {
    this.setState({ equipmentUnit: value })
  }

  handleCustomerChange = (event, { value }) => {
    this.setState({ customer: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const rental = {
      equipmentUnit: this.state.equipmentUnit,
      customer: this.state.customer,
      start: this.state.start,
      end: this.state.end,
      timeUnit: this.state.timeUnit,
      price: this.state.price
    }
    this.props.createRental(rental)
    this.props.history.push('/rentals')
  }

  render() {
    return (
      <div>
        <ViewHeader text={'Rent equipment'} />
        <LinkButton text={'To rental list'} to={'/rentals'} type={'default'} />
        <LinkButton text={'To customer list'} to={'/customers'} type={'default'} />
        <LinkButton text={'To equipment list'} to={'/equipment'} type={'default'} />
        <Form style={formStyle} onSubmit={this.handleSubmit}>
          <Form.Field required control={Select} width={6} label='Equipment' name='equipment'
            options={this.props.equipmentUnits} value={this.state.equipmentUnit} onChange={this.handleEquipmentUnitChange} />
          <Form.Field required control={Select} width={6} label='Customer' name='customer'
            options={this.props.customers} value={this.state.customer} onChange={this.handleCustomerChange} />
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
          <Form.Field required control={Select} width={6} label='Rented by' name='timeUnit'
            options={timeUnitOptions} value={this.state.timeUnit} onChange={this.handleChange} />
          <Form.Field control={Input} width={6} label='Rate' name='price'
            value={this.state.price} onChange={this.handleChange} />
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

const mapStateToProps = (store) => {
  return {
    equipmentUnits: store.equipmentUnits
      .map(e => {
        return {
          key: e._id,
          text: `${e.equipment.makeAndModel} / ${e.assetID}`,
          value: e._id
        }
      })
      .sort((a, b) => a.text > b.text),
    customers: store.customers
      .map(c => {
        return {
          key: c._id,
          text: c.displayName,
          value: c._id
        }
      })
      .sort((a, b) => a.text > b.text)
  }
}

export default withRouter(connect(
  mapStateToProps,
  { createRental }
)(RentalCreate))