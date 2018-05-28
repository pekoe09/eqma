import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Form, Button } from 'semantic-ui-react'
import { confirmRental } from '../../reducers/rentalReducer'

const formStyle = {
  marginTop: 10
}

const tightRowStyle = {
  marginBottom: 3
}

class Rental extends React.Component {

  render() {
    const rental = this.props.rental
    return (
      <div>
        <ViewHeader text='Rental details' />
        <LinkButton text='To rental list' to='/rentals' type='default' />
        <LinkButton text='Edit' to={`/rentals/edit/${rental._id}`} type='primary' />
        {rental.isReservation &&
          <Button primary onClick={() => this.props.confirmRental(this.props.rental)}>Confirm reservation into rental</Button>
        }
        <Form style={formStyle}>
          {rental.isReservation && <h3>This is a reservation</h3>}
          <Form.Field>
            <label>Customer</label>
            <p>{rental.customer.displayName}</p>
          </Form.Field>
          <Form.Field>
            <label>Contact details</label>
            <p style={tightRowStyle}>{rental.customer.email}</p>
            <p>{rental.customer.phone}</p>
          </Form.Field>
          <Form.Field>
            <label>Equipment</label>
            <p>{rental.equipmentUnit.equipment.makeAndModel}</p>
          </Form.Field>
          <Form.Field>
            <label>Asset ID</label>
            <p>{rental.equipmentUnit.assetID}</p>
          </Form.Field>
          <Form.Field>
            <label>Rental period</label>
            <p style={tightRowStyle}>from {moment(rental.start).format('MM/DD/YYYY HH:mm')}</p>
            <p>to {rental.end ? moment(rental.end).format('MM/DD/YYYY HH:mm') : ''}</p>
          </Form.Field>
          <Form.Field>
            <label>Rented at</label>
            <p>{Number(rental.price).toFixed(2)} / {rental.timeUnit}</p>
          </Form.Field>
          <Form.Field>
            <label>Total rent</label>
            <p>{rental.totalPrice ? Number(Math.round(rental.totalPrice + 'e2') + 'e-2') : '-'}</p>
          </Form.Field>
        </Form>
      </div>
    )
  }

}

const mapStateToProps = (store, ownProps) => {
  const rental = store.rentals.find(r => r._id === ownProps.match.params.id)
  return {
    rental
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    confirmRental
  }
)(Rental))