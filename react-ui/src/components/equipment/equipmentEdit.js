import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button, Confirm } from 'semantic-ui-react'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { updateEquipment, removeEquipment } from '../../reducers/equipmentReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

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
    equipmentType: this.props.initialEquipment.equipmentType ? this.props.initialEquipment.equipmentType._id : '',
    make: this.props.initialEquipment.make ? this.props.initialEquipment.make : '',
    model: this.props.initialEquipment.model ? this.props.initialEquipment.model : '',
    description: this.props.initialEquipment.description ? this.props.initialEquipment.description : '',
    price: this.props.initialEquipment.price ? this.props.initialEquipment.price : '',
    timeUnit: this.props.initialEquipment.timeUnit,
    openDeleteConfirm: false
  }

  handleChange = (event, { value }) => {
    this.setState({ [event.target.name]: value })
  }

  handleTimeUnitChange = (event, { value }) => {
    this.setState({ timeUnit: value })
  }

  handleEquipmentTypeChange = (event, { value }) => {
    this.setState({ equipmentType: value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    let equipment = this.props.initialEquipment
    equipment.equipmentType = this.state.equipmentType
    equipment.make = this.state.make
    equipment.model = this.state.model
    equipment.description = this.state.description
    equipment.price = this.state.price
    equipment.timeUnit = this.state.timeUnit
    console.log('Saving', equipment)
    await this.props.updateEquipment(equipment)
    this.props.history.push('/equipment')
  }

  handleRemove = async () => {
    this.setState({ openDeleteConfirm: true })
  }

  handleConfirmedRemove = async () => {
    const name = this.props.initialEquipment.makeAndModel
    await this.props.removeEquipment(this.props.initialEquipment._id)
    this.props.addUIMessage(`Equipment ${name} deleted`, 'success', 10)
    this.props.history.push('/equipment')
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false })
  }

  render() {
    if (this.props.initialEquipment) {
      return (
        <div>
          <ViewHeader text={`Edit equipment ${this.props.initialEquipment.makeAndModel}`} />
          <LinkButton text={'Cancel'} to={'/equipment'} type={'default'} />
          <Button negative onClick={this.handleRemove}>Delete</Button>
          <Confirm
            open={this.state.openDeleteConfirm}
            header='Deleting a piece of equipment'
            content={`Deleting equipment ${this.props.initialEquipment.makeAndModel}. The operation is permanent; are you sure?`}
            confirmButton='Yes, delete'
            onConfirm={this.handleConfirmedRemove}
            onCancel={this.handleCancelledRemove}
          />
          <Form style={formStyle} onSubmit={this.handleSubmit}>
            <Form.Field required control={Select} width={6} label='Equipment type' name='equipmentType'
              options={this.props.equipmentTypes} value={this.state.equipmentType} onChange={this.handleEquipmentTypeChange} />
            <Form.Field control={Input} width={6} label='Make' name='make'
              value={this.state.make} onChange={this.handleChange} />
            <Form.Field control={Input} width={6} label='Model' name='model'
              value={this.state.model} onChange={this.handleChange} />
            <Form.TextArea width={12} rows={5} label='Description' name='description'
              value={this.state.description} onChange={this.handleChange} />
            <Form.Field required control={Select} width={6} label='Rented by' name='timeUnit'
              options={timeUnitOptions} value={this.state.timeUnit} onChange={this.handleTimeUnitChange} />
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
    } else {
      return <div></div>
    }
  }
}

const mapStateToProps = (store, ownProps) => {
  const initialEquipment = store.equipments.find(e => e._id === ownProps.match.params.id)
  const equipmentTypes = store.equipmentTypes.map(e => {
    return {
      key: e._id,
      text: e.name,
      value: e._id
    }
  })
  return {
    initialEquipment,
    equipmentTypes
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    updateEquipment,
    removeEquipment,
    addUIMessage
  }
)(EquipmentEdit))