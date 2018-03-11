import React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'
import { Button } from 'semantic-ui-react'

class Rentals extends React.Component {

  render() {

    const columns = [
      {
        Header: 'Customer',
        accessor: 'customer.name'
      },
      {
        Header: 'Equipment',
        accessor: 'equipment.makeAndModel'
      },
      {
        Header: 'Start',
        accessor: 'start'
      },
      {
        Header: 'End',
        accessor: 'end'
      },
      {
        Header: 'Price',
        accessor: 'price'
      },
      {
        Header: 'Total',
        accessor: 'totalPrice'
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