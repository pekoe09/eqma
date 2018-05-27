import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Form, Button, Confirm } from 'semantic-ui-react'
import { removeEquipmentType } from '../../reducers/equipmentTypeReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

const formStyle = {
  marginTop: 10
}

class EquipmentType extends React.Component {

  state = {
    openDeleteConfirm: false
  }

  handleRemove = async () => {
    this.setState({ openDeleteConfirm: true })
  }

  handleConfirmedRemove = async () => {
    const name = this.props.equipmentType.name
    await this.props.removeEquipmentType(this.props.equipmentType._id)
    this.props.addUIMessage(`Equipment type ${name} deleted`, 'success', 10)
    this.props.history.push('/equipmenttypes')
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false })
  }

  render() {
    const equipmentType = this.props.equipmentType
    if (equipmentType) {
      return (
        <div>
          <ViewHeader text={`Equipment type: ${equipmentType.name}`} />
          <LinkButton text={'To equipment type list'} to={'/equipmenttypes'} type={'default'} />
          <LinkButton text={'Edit'} to={`/equipmenttypes/edit/${equipmentType._id}`} type={'primary'} />
          <Button negative onClick={this.handleRemove}>Delete</Button>
          <Confirm
            open={this.state.openDeleteConfirm}
            header='Deleting an equipment type'
            content={`Deleting equipment type ${this.props.equipmentType.name}. The operation is permanent; are you sure?`}
            confirmButton='Yes, delete'
            onConfirm={this.handleConfirmedRemove}
            onCancel={this.handleCancelledRemove}
          />
          <Form style={formStyle}>
            <Form.Field>
              <label>Name</label>
              <p>{equipmentType.name ? equipmentType.name : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Parent type</label>
              <p>{equipmentType.parentType ? equipmentType.parentType.name : '-'}</p>
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
  const equipmentType = store.equipmentTypes.find(e => e._id === ownProps.match.params.id)
  return {
    equipmentType
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    removeEquipmentType,
    addUIMessage
  }
)(EquipmentType))