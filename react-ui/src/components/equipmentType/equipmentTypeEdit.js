import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button, Confirm } from 'semantic-ui-react'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { updateEquipmentType, removeEquipmentType } from '../../reducers/equipmentTypeReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

const formStyle = {
  marginTop: 10
}

class EquipmentTypeEdit extends React.Component {
  state = {
    name: this.props.initialEquipmentType.name,
    parentType: this.props.initialEquipmentType.parentType,
    openDeleteConfirm: false
  }

  handleChange = (event, { value }) => {
    if (event.target.name) {
      this.setState({ [event.target.name]: value })
    } else {
      this.setState({ parentType: value })
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    let equipmentType = this.props.initialEquipmentType
    equipmentType.name = this.state.name
    equipmentType.parentType = this.state.parentType ? this.state.parentType : null
    await this.props.updateEquipmentType(equipmentType)
    this.props.history.push('/equipmenttypes')
  }

  handleConfirmedRemove = async () => {
    const name = this.props.initialEquipmentType.name
    await this.props.removeEquipmentType(this.props.initialEquipmentType._id)
    this.props.addUIMessage(`Equipment type ${name} deleted`, 'success', 10)
    this.props.history.push('/equipmenttypes')
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false })
  }

  render() {
    if (this.props.initialEquipmentType) {
      return (
        <div>
          <ViewHeader text={`Edit equipment type ${this.props.initialEquipmentType.name}`} />
          <LinkButton text={'Cancel'} to={'/equipmenttypes'} type={'default'} />
          <Button negative onClick={this.handleRemove}>Delete</Button>
          <Confirm
            open={this.state.openDeleteConfirm}
            header='Deleting an equipment type'
            content={`Deleting equipment type ${this.props.initialEquipmentType.name}. The operation is permanent; are you sure?`}
            confirmButton='Yes, delete'
            onConfirm={this.handleConfirmedRemove}
            onCancel={this.handleCancelledRemove}
          />
          <Form style={formStyle} onSubmit={this.handleSubmit}>
            <Form.Field required control={Input} width={6} label='Name' name='name'
              value={this.state.name} onChange={this.handleChange} />
            <Form.Field control={Select} width={6} label='Parent type' name='parentType'
              options={this.props.equipmentTypes} value={this.state.parentType ? this.state.parentType._id : ''} onChange={this.handleChange} />
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
  const initialEquipmentType = store.equipmentTypes.find(e => e._id === ownProps.match.params.id)
  const equipmentTypes = store.equipmentTypes.map(e => {
    return {
      key: e._id,
      text: e.name,
      value: e._id
    }
  }).sort().concat({ key: '', text: '<not selected>', value: '' })
  return {
    initialEquipmentType,
    equipmentTypes
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    updateEquipmentType,
    removeEquipmentType,
    addUIMessage
  }
)(EquipmentTypeEdit))