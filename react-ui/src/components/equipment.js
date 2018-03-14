import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'
import { Form } from 'semantic-ui-react'

const formStyle = {
  marginTop: 10
}

class Equipment extends React.Component {

  render() {
    const equipment = this.props.equipment
    return (
      <div>
        <ViewHeader text={`Equipment: ${equipment.name}`} />
        <LinkButton text={'To equipment list'} to={'/equipment'} type={'default'} />
        <LinkButton text={'Edit'} to={`/equipment/edit/${equipment._id}`} type={'primary'} />
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
  }
}

const mapStateToProps = (store, ownProps) => {
  const equipment = store.equipments.find(e => e._id === ownProps.match.params.id)
  return {
    equipment
  }
}

export default withRouter(connect(
  mapStateToProps
)(Equipment))