import React from 'react'
import RentasSublistItem from './rentalsSublistItem'
import { Table } from 'semantic-ui-react'

const RentalsSublist = ({ rentals, handleRowClick }) => {

  const handleItemClick = (rentalID) => {
    handleRowClick(rentalID)
  }

  const items = rentals.map(r =>
    <RentasSublistItem key={r._id} rental={r} handleRowClick={() => { handleItemClick(r._id) }} />
  )

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Equipment</Table.HeaderCell>
          <Table.HeaderCell>Start</Table.HeaderCell>
          <Table.HeaderCell>End</Table.HeaderCell>
          <Table.HeaderCell>Price</Table.HeaderCell>
          <Table.HeaderCell>Reservation?</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items}
      </Table.Body>
    </Table>
  )
}

export default RentalsSublist