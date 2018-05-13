import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button, Confirm } from 'semantic-ui-react'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { updateEquipmentUnit, removeEquipmentUnit } from '../../reducers/equipmentUnitReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

const formStyle = {
  marginTop: 10
}

class EquipmentUnitEdit extends React.Component {
  state = {
    equipment: this.props.initialEquipmentUnit.equipment,
    registration: this.props.initialEquipmentUnit.registration,
    VIN: this.props.initialEquipmentUnit.VIN,
    assetID: this.props.initialEquipmentUnit.assetID,
    openDeleteConfirm: false
  }

  handleChange = (event, { value }) => {
    if (event.target.name) {
      this.setState({ [event.target.name]: value })
    } else {
      this.setState({ equipment: value })
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    let equipmentUnit = this.props.initialEquipmentUnit
    equipmentUnit.equipment = this.state.equipment
    equipmentUnit.registration = this.state.registration
    equipmentUnit.VIN = this.state.VIN
    equipmentUnit.assetID = this.state.assetID
    await this.props.updateEquipmentUnit(equipmentUnit)
    this.props.history.push('/equipmentunits')
  }

  handleConfirmedRemove = async () => {
    const makeAndModel = this.props.initialEquipmentUnit.equipment.makeAndModel
    const assetID = this.props.initialEquipmentUnit.assetID
    await this.props.removeEquipmentUnit(this.props.initialEquipmentUnit._id)
    this.props.addUIMessage(`Equipment unit ${makeAndModel} / ${assetID} deleted`, 'success', 10)
    this.props.history.push('/equipmentunits')
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false })
  }

  render() {
    if (this.props.initialEquipmentUnit) {
      return (
        <div>
          <ViewHeader text={`Edit equipment unit 
            ${this.props.initialEquipmentUnit.equipment.makeAndModel} / 
            ${this.props.initialEquipmentUnit.assetID}`} />
          <LinkButton text={'Cancel'} to={'/equipmentunits'} type={'default'} />
          <Button negative onClick={this.handleRemove}>Delete</Button>
          <Confirm
            open={this.state.openDeleteConfirm}
            header='Deleting an equipment unit'
            content={`Deleting equipment unit 
              ${this.props.initialEquipmentUnit.equipment.makeAndModel} /
              ${this.props.initialEquipmentUnit.assetID} . The operation is permanent; are you sure?`}
            confirmButton='Yes, delete'
            onConfirm={this.handleConfirmedRemove}
            onCancel={this.handleCancelledRemove}
          />
          <Form style={formStyle} onSubmit={this.handleSubmit}>
            <Form.Field required control={Select} width={6} label='Equipment' name='equipment'
              options={this.props.equipments} value={this.state.equipment} onChange={this.handleChange} />
            <Form.Field control={Input} width={6} label='Registration' name='registration'
              value={this.state.registration} onChange={this.handleChange} />
            <Form.Field control={Input} width={6} label='VIN' name='VIN'
              value={this.state.VIN} onChange={this.handleChange} />
            <Form.Field required control={Input} width={6} label='Asset ID' name='assetID'
              value={this.state.assetID} onChange={this.handleChange} />
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
  const initialEquipmentUnit = store.equipmentUnits.find(e => e._id === ownProps.match.params.id)
  const equipments = store.equipments.map(e => {
    return {
      key: e._id,
      text: e.makeAndModel,
      value: e._id
    }
  })
  return {
    initialEquipmentUnit,
    equipments
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    updateEquipmentUnit,
    removeEquipmentUnit,
    addUIMessage
  }
)(EquipmentUnitEdit))