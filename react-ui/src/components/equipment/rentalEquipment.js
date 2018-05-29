import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from '../structure/viewHeader'
import RentalReservationForm from '../rentals/rentalReservationForm'

class RentalEquipment extends React.Component {

  render() {
    const equipment = this.props.equipment

    return (
      <div>
        <ViewHeader text={equipment.makeAndModel} />
        <div>{equipment.equipmentType.name}</div>
        <div>{equipment.description}</div>
        <div>{equipment.price} / {equipment.timeUnit}</div>
        {
          this.props.user &&
          <RentalReservationForm
            equipmentID={equipment._id}
            makeAndModel={equipment.makeAndModel}
            price={equipment.price}
            timeUnit={equipment.timeUnit}
          />
        }
        {
          !this.props.user &&
          <div>
            <h3>Log in to make a reservation!</h3>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (store, ownProps) => {
  const loginState = store.login
  return {
    equipment: store.equipments.find(e => e._id === ownProps.match.params.id),
    user: loginState ? loginState.user : null
  }
}

export default withRouter(connect(
  mapStateToProps
)(RentalEquipment))