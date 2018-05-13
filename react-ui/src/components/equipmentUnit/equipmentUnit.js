import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Form, Button, Confirm } from 'semantic-ui-react'
import { removeEquipmentUnit } from '../../reducers/equipmentUnitReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

const formStyle = {
  marginTop: 10
}

class EquipmentUnit extends React.Component {
  state = {
    openDeleteConfirm: false
  }

  handleRemove = async () => {
    this.setState({ openDeleteConfirm: true })
  }

  handleConfirmedRemove = async () => {
    const makeAndModel = this.props.equipmentUnit.equipment.makeAndModel
    const assetId = this.props.equipmentUnit.assetId
    await this.props.removeEquipmentUnit(this.props.equipmentUnit._id)
    this.props.addUIMessage(`Equipment unit ${makeAndModel} / ${assetId} deleted`, 'success', 10)
    this.props.history.push('/equipmentunits')
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false })
  }

  render() {
    const equipmentUnit = this.props.equipmentUnit
    if (equipmentUnit) {
      return (
        <div>
          <ViewHeader text={`Equipment unit: ${equipmentUnit.equipment.makeAndModel} / ${equipmentUnit.assetId}`} />
          <LinkButton text={'To equipment unit list'} to={'/equipmentunits'} type={'default'} />
          <LinkButton text={'Edit'} to={`/equipmentunits/edit/${equipmentUnit._id}`} type={'primary'} />
          <Button negative onClick={this.handleRemove}>Delete</Button>
          <Confirm
            open={this.state.openDeleteConfirm}
            header='Deleting an equipment unit'
            content={`Deleting equipment unit 
              ${this.props.equipmentUnit.equipment.makeAndModel}
              ${this.props.equipmentUnit.assetId}
              . The operation is permanent; are you sure?`}
            confirmButton='Yes, delete'
            onConfirm={this.handleConfirmedRemove}
            onCancel={this.handleCancelledRemove}
          />
          <Form style={formStyle}>
            <Form.Field>
              <label>Equipment</label>
              <p>{equipmentUnit.equipment ? equipmentUnit.equipment.makeAndModel : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Type</label>
              <p>{equipmentUnit.equipment ? equipmentUnit.equipment.equipmentType.name : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Asset ID</label>
              <p>{equipmentUnit.assetId ? equipmentUnit.assetId : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Registration</label>
              <p>{equipmentUnit.registration ? equipmentUnit.registration : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>VIN</label>
              <p>{equipmentUnit.VIN ? equipmentUnit.VIN : '-'}</p>
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
  const equipmentUnit = store.equipmentUnits.find(e => e._id === ownProps.match.params.id)
  return {
    equipmentUnit
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    removeEquipmentUnit,
    addUIMessage
  }
)(EquipmentUnit))