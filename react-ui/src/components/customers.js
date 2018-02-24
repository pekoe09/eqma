import React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'
import { Button } from 'semantic-ui-react'
import { removeCustomer } from '../reducers/customerReducer'

class Customers extends React.Component {

  handleRemove = (id) => {
    this.props.removeCustomer(id)
  }

  render() {

    const columns = [
      {
        Header: 'Name',
        accessor: 'fullName',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'City',
        accessor: 'billingAddress.city',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'City',
        accessor: 'billingAddress.city',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: '',
        accessor: 'delete',
        Cell: (row) => (
          <Button negative basic className='mini' onClick={() =>
            this.handleRemove(row.original._id)}>Delete</Button>
        ),
        style: {
          textAlign: 'center'
        },
        maxWidth: 100
      }
    ]

    const tableStyle = {
      marginTop: 10,
      lineHeight: 2
    }

    return (
      <div>
        <ViewHeader text={'Customers'} />
        <LinkButton text={'Add a customer'} to={'/customers/create'} />
        <ReactTable
          data={this.props.customers}
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
    customers: store.customers.map(c => {
      return {
        ...c,
        fullName: c.company ? c.company : `${c.lastName}, ${c.firstNames}`
      }
    })
  }
}

export default connect(
  mapStateToProps,
  { removeCustomer }
)(Customers)