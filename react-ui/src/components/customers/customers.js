import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Button } from 'semantic-ui-react'
import { removeCustomer } from '../../reducers/customerReducer'

class Customers extends React.Component {

  handleRemove = async (id, e) => {
    e.stopPropagation()
    await this.props.removeCustomer(id)
  }

  render() {

    const columns = [
      {
        Header: 'Name',
        accessor: 'displayName',
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
          <Button negative basic className='mini' onClick={(e) =>
            this.handleRemove(row.original._id, e)}>Delete</Button>
        ),
        style: {
          textAlign: 'center'
        },
        sortable: false,
        filterable: false,
        maxWidth: 80
      }
    ]

    const handleRowClick = (state, rowInfo, column, instance) => {
      const history = this.props.history
      return {
        onClick: (e, handleOriginal) => {
          history.push(`/customers/details/${rowInfo.original._id}`)
          if (handleOriginal) {
            handleOriginal()
          }
        }
      }
    }

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
          getTrProps={handleRowClick}
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
    customers: store.customers
  }
}

export default withRouter(connect(
  mapStateToProps,
  { removeCustomer }
)(Customers))