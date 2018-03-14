import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button } from 'semantic-ui-react'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'
import { updateEquipment } from '../reducers/equipmentReducer'

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

class EquipmentEdit extends React.Component {
  state = {
    name: this.props.initialEquipment.name,
    make: this.props.initialEquipment.make,
    model: this.props.initialEquipment.model,
    description: this.props.initialEquipment.description,
    price: this.props.initialEquipment.price,
    timeUnit: this.props.initialEquipment.timeUnit
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    let equipment = this.props.initialEquipment
    equipment.name = this.state.name
    equipment.make = this.state.make
    equipment.model = this.state.model
    equipment.description = this.state.description
    equipment.price = this.state.price
    equipment.timeUnit = this.state.timeUnit
    await this.props.updateEquipment(equipment)
    this.props.history.push('/equipment')
  }

  render() {
    return (
      <div>
        <ViewHeader text={`Edit equipment ${this.props.initialEquipment.name} (${this.props.initialEquipment.makeAndModel})`} />
        <LinkButton text={'Cancel'} to={'/equipment'} type={'default'} />
        <Form style={formStyle} onSubmit={this.handleSubmit}>
          <Form.Field required control={Input} width={6} label='Name' name='name'
            value={this.state.name} onChange={this.handleChange} />
          <Form.Field control={Input} width={6} label='Make' name='make'
            value={this.state.make} onChange={this.handleChange} />
          <Form.Field control={Input} width={6} label='Model' name='model'
            value={this.state.model} onChange={this.handleChange} />
          <Form.TextArea width={12} rows={5} label='Description' name='description'
            value={this.state.description} onChange={this.handleChange} />
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

const mapStateToProps = (store, ownProps) => {
  const initialEquipment = store.equipments.find(e => e._id === ownProps.match.params.id)
  return {
    initialEquipment
  }
}

export default withRouter(connect(
  mapStateToProps,
  { updateEquipment }
)(EquipmentEdit))