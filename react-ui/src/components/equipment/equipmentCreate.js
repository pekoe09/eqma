import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button } from 'semantic-ui-react'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { createEquipment } from '../../reducers/equipmentReducer'

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

class EquipmentCreate extends React.Component {
  state = {
    equipmentType: '',
    make: '',
    model: '',
    description: '',
    price: '',
    timeUnit: ''
  }

  handleChange = (event, { value }) => {
    if (event.target.name) {
      this.setState({ [event.target.name]: value })
    } else {
      this.setState({ timeUnit: value })
    }
  }

  handleEquipmentChange = ({ value }) => {
    this.setState({ equipmentType: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const equipment = {
      equipmentType: this.state.equipmentType,
      make: this.state.make,
      model: this.state.model,
      description: this.state.description,
      price: this.state.price ? Number(this.state.price) : null,
      timeUnit: this.state.timeUnit
    }
    this.props.createEquipment(equipment)
    this.props.history.push('/equipment')
  }

  render() {
    return (
      <div>
        <ViewHeader text={'Add a piece of equipment'} />
        <LinkButton text={'Cancel'} to={'/equipment'} type={'default'} />
        <Form style={formStyle} onSubmit={this.handleSubmit}>
          <Form.Field required control={Select} width={6} label='Equipment type' name='equipmentType'
            options={this.props.equipmentTypes} value={this.state.equipmentType} onChange={this.handleEquipmentChange} />
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

const mapStateToProps = (store) => {
  return {
    equipmentTypes: store.equipmentTypes.map(e => {
      return {
        key: e._id,
        text: e.name,
        value: e._id
      }
    })
  }
}

export default withRouter(connect(
  mapStateToProps,
  { createEquipment }
)(EquipmentCreate))