import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import moment from 'moment'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Button, Confirm } from 'semantic-ui-react'
import { removeRental } from '../../reducers/rentalReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class Rentals extends React.Component {

  state = {
    openDeleteConfirm: false,
    rowToDelete: null
  }

  handleRemove = (row, e) => {
    e.stopPropagation()
    this.setState({ openDeleteConfirm: true, rowToDelete: row })
  }

  handleConfirmedRemove = async () => {
    const makeAndModel = this.state.rowToDelete.equipmentMakeAndModel
    const customer = this.state.rowToDelete.customerName
    this.setState({ openDeleteConfirm: false, rowToDelete: null })
    await this.props.removeRental(this.state.rowToDelete._id)
    this.props.addUIMessage(`Rental of ${makeAndModel} to ${customer} deleted`, 'success', 10)
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false, rowToDelete: null })
  }

  render() {

    const columns = [
      {
        Header: 'Customer',
        accessor: 'customerName',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Equipment',
        accessor: 'equipmentMakeAndModel',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Asset ID',
        accessor: 'equipmentUnitAssetID',
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
        Header: 'Rent total',
        accessor: 'totalPrice',
        Cell: row => {
          if (row.original.totalPrice) {
            return Number(Math.round(row.original.totalPrice + 'e2') + 'e-2')
          } else
            return 'n/a'
        },
        style: {
          textAlign: 'center'
        },
        maxWidth: 150
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
          history.push(`/rentals/details/${rowInfo.original._id}`)
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
        <ViewHeader text={'Rentals'} />
        <LinkButton text={'Rent equipment'} to={'/rentals/create'} />
        <Confirm
          open={this.state.openDeleteConfirm}
          header='Deleting a rental'
          content={`Deleting rental of
          ${this.state.rowToDelete
              ? this.state.rowToDelete.equipmentMakeAndModel
              : ''} to          
          ${this.state.rowToDelete
              ? this.state.rowToDelete.customerName
              : ''}. 
          The operation is permanent; are you sure?`}
          confirmButton='Yes, delete'
          onConfirm={this.handleConfirmedRemove}
          onCancel={this.handleCancelledRemove}
        />
        <ReactTable
          data={this.props.rentals}
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
    rentals: store.rentals.map(r => {
      return {
        _id: r._id,
        customerName: r.customer.displayName,
        equipmentMakeAndModel: r.equipmentUnit.equipment.makeAndModel,
        equipmentUnitAssetID: r.equipmentUnit.assetID,
        start: r.start,
        end: r.end,
        price: r.price,
        timeUnit: r.timeUnit,
        totalPrice: r.totalPrice
      }
    })
  }
}

export default withRouter(connect(
  mapStateToProps,
  { removeRental, addUIMessage }
)(Rentals))