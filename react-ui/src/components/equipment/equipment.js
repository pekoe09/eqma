import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Form, Button, Confirm } from 'semantic-ui-react'
import { removeEquipment } from '../../reducers/equipmentReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

const formStyle = {
  marginTop: 10
}

class Equipment extends React.Component {

  state = {
    openDeleteConfirm: false
  }

  handleRemove = async () => {
    this.setState({ openDeleteConfirm: true })
  }

  handleConfirmedRemove = async () => {
    const name = this.props.equipment.makeAndModel
    await this.props.removeEquipment(this.props.equipment._id)
    this.props.addUIMessage(`Equipment ${name} deleted`, 'success', 10)
    this.props.history.push('/equipment')
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false })
  }

  render() {
    const equipment = this.props.equipment
    if (equipment) {
      return (
        <div>
          <ViewHeader text={`Equipment: ${equipment.name}`} />
          <LinkButton text={'To equipment list'} to={'/equipment'} type={'default'} />
          <LinkButton text={'Edit'} to={`/equipment/edit/${equipment._id}`} type={'primary'} />
          <Button negative onClick={this.handleRemove}>Delete</Button>
          <Confirm
            open={this.state.openDeleteConfirm}
            header='Deleting a piece of equipment'
            content={`Deleting equipment ${this.props.equipment.makeAndModel}. The operation is permanent; are you sure?`}
            confirmButton='Yes, delete'
            onConfirm={this.handleConfirmedRemove}
            onCancel={this.handleCancelledRemove}
          />
          <Form style={formStyle}>
            <Form.Field>
              <label>Name</label>
              <p>{equipment.name ? equipment.name : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Make</label>
              <p>{equipment.make ? equipment.make : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Model</label>
              <p>{equipment.model ? equipment.model : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Description</label>
              <p>{equipment.description ? equipment.description : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Rented by</label>
              <p>{equipment.timeUnit ? equipment.timeUnit : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Price</label>
              <p>{equipment.price ? equipment.price : '-'}</p>
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
  const equipment = store.equipments.find(e => e._id === ownProps.match.params.id)
  return {
    equipment
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    removeEquipment,
    addUIMessage
  }
)(Equipment))