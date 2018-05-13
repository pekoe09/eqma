import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button } from 'semantic-ui-react'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { createEquipmentUnit } from '../../reducers/equipmentUnitReducer'

const formStyle = {
  marginTop: 10
}

class EquipmentUnitCreate extends React.Component {
  state = {
    equipment: '',
    registration: '',
    VIN: '',
    assetID: ''
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
    const equipmentUnit = {
      equipment: this.state.equipment,
      registration: this.state.registration,
      VIN: this.state.VIN,
      assetID: this.state.assetID
    }
    this.props.createEquipmentUnit(equipmentUnit)
    this.props.history.push('/equipmentunits')
  }

  render() {
    return (
      <div>
        <ViewHeader text={'Add an equipment type'} />
        <LinkButton text={'Cancel'} to={'/equipmenttypes'} type={'default'} />
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
  }
}

const mapStateToProps = (store) => {
  return {
    equipments: store.equipments.map(e => {
      return {
        key: e._id,
        text: e.makeAndModel,
        value: e._id
      }
    })
  }
}

export default withRouter(connect(
  mapStateToProps,
  { createEquipmentUnit }
)(EquipmentUnitCreate))