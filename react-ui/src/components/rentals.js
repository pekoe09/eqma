import React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import moment from 'moment'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'
import { Button } from 'semantic-ui-react'

class Rentals extends React.Component {

  render() {

    const columns = [
      {
        Header: 'Customer',
        accessor: 'customer.displayName',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Equipment',
        accessor: 'equipment.makeAndModel',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Start',
        accessor: 'start',
        Cell: row => (moment(row.original.start).format('MM/DD/YYYY HH:mm')),
        style: {
          textAlign: 'center'
        },
        maxWidth: 150
      },
      {
        Header: 'End',
        accessor: 'end',
        Cell: row => (moment(row.original.end).format('MM/DD/YYYY HH:mm')),
        style: {
          textAlign: 'center'
        },
        maxWidth: 150
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: row => Number(row.original.price).toFixed(2) + ' / ' + row.original.timeUnit,
        style: {
          textAlign: 'center'
        },
        maxWidth: 150
      },
      {
        Header: 'Total',
        accessor: 'totalPrice',
        Cell: row => Number(Math.round(row.original.totalPrice + 'e2') + 'e-2'),
        style: {
          textAlign: 'center'
        },
        maxWidth: 150
      }
    ]

    const tableStyle = {
      marginTop: 10,
      lineHeight: 2
    }

    return (
      <div>
        <ViewHeader text={'Rentals'} />
        <LinkButton text={'Rent equipment'} to={'/rentals/create'} />
        <ReactTable
          data={this.props.rentals}
          columns={columns}
          defaultPageSize={10}
          minRows={1}
          style={tableStyle}
        />
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    rentals: store.rentals
  }
}

export default connect(
  mapStateToProps
)(Rentals)