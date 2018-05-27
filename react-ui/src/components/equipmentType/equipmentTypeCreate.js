import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Select, Button } from 'semantic-ui-react'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { createEquipmentType } from '../../reducers/equipmentTypeReducer'

const formStyle = {
  marginTop: 10
}

class EquipmentTypeCreate extends React.Component {
  state = {
    name: '',
    parentType: ''
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
    const equipmentType = {
      name: this.state.name,
      parentType: this.state.parentType
    }
    this.props.createEquipmentType(equipmentType)
    this.props.history.push('/equipmenttypes')
  }

  render() {
    return (
      <div>
        <ViewHeader text={'Add an equipment type'} />
        <LinkButton text={'Cancel'} to={'/equipmenttypes'} type={'default'} />
        <Form style={formStyle} onSubmit={this.handleSubmit}>
          <Form.Field required control={Input} width={6} label='Name' name='name'
            value={this.state.name} onChange={this.handleChange} />
          <Form.Field control={Select} width={6} label='Parent type' name='parentType'
            options={this.props.equipmentTypes} value={this.state.parentType} onChange={this.handleChange} />
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
  { createEquipmentType }
)(EquipmentTypeCreate))