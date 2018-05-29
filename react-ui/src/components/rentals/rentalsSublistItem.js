import React from 'react'
import moment from 'moment'
import { Table } from 'semantic-ui-react'

const RentalSublistItem = ({ rental, handleRowClick }) => {
  return (
    <Table.Row onClick={handleRowClick}>
      <Table.Cell>{rental.makeAndModel}</Table.Cell>
      <Table.Cell>{moment(rental.start).format('MM/DD/YYYY')}</Table.Cell>
      <Table.Cell>{rental.end ? moment(rental.end).format('MM/DD/YYYY') : ''}</Table.Cell>
      <Table.Cell>{rental.price}</Table.Cell>
      <Table.Cell>{rental.isReservation}</Table.Cell>
    </Table.Row>
  )
}

export default RentalSublistItem