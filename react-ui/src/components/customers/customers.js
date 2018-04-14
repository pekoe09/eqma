import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Button, Confirm } from 'semantic-ui-react'
import { removeCustomer } from '../../reducers/customerReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class Customers extends React.Component {

  state = {
    openDeleteConfirm: false,
    rowToDelete: null
  }

  handleRemove = (row, e) => {
    e.stopPropagation()
    this.setState({ openDeleteConfirm: true, rowToDelete: row })
  }

  handleConfirmedRemove = async () => {
    const displayName = this.state.rowToDelete.displayName
    this.setState({ openDeleteConfirm: false, rowToDelete: null })
    await this.props.removeCustomer(this.state.rowToDelete._id)
    this.props.addUIMessage(`Customer ${displayName} deleted`, 'success', 10)
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false, rowToDelete: null })
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
            this.handleRemove(row.original, e)}>Delete</Button>
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
        <Confirm
          open={this.state.openDeleteConfirm}
          header='Deleting a customer'
          content={`Deleting ${this.state.rowToDelete ? this.state.rowToDelete.displayName : ''}. The operation is permanent; are you sure?`}
          confirmButton='Yes, delete'
          onConfirm={this.handleConfirmedRemove}
          onCancel={this.handleCancelledRemove}
        />
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
  { removeCustomer, addUIMessage }
)(Customers))