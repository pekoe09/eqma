import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Button, Confirm } from 'semantic-ui-react'
import { removeEquipment } from '../../reducers/equipmentReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class Equipments extends React.Component {

  state = {
    openDeleteConfirm: false,
    rowToDelete: null
  }

  handleRemove = (row, e) => {
    e.stopPropagation()
    this.setState({ openDeleteConfirm: true, rowToDelete: row })
  }

  handleConfirmedRemove = async () => {
    const makeAndModel = this.state.rowToDelete.makeAndModel
    this.setState({ openDeleteConfirm: false, rowToDelete: null })
    await this.props.removeEquipment(this.state.rowToDelete._id)
    this.props.addUIMessage(`Equipment ${makeAndModel} deleted`, 'success', 10)
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false, rowToDelete: null })
  }

  render() {

    const columns = [
      {
        Header: 'Name',
        accessor: 'name',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Make and model',
        accessor: 'makeAndModel',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Rate',
        accessor: 'price',
        style: {
          textAlign: 'center'
        },
        maxWidth: 100
      },
      {
        Header: 'Rented by',
        accessor: 'timeUnit',
        style: {
          textAlign: 'center'
        },
        maxWidth: 100
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
          history.push(`/equipment/details/${rowInfo.original._id}`)
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
        <ViewHeader text={'Equipment list'} />
        <LinkButton text={'Add a piece of equipment'} to={'/equipment/create'} />
        <Confirm
          open={this.state.openDeleteConfirm}
          header='Deleting a piece of equipment'
          content={`Deleting ${this.state.rowToDelete ? this.state.rowToDelete.makeAndModel : ''}. The operation is permanent; are you sure?`}
          confirmButton='Yes, delete'
          onConfirm={this.handleConfirmedRemove}
          onCancel={this.handleCancelledRemove}
        />
        <ReactTable
          data={this.props.equipments}
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
    equipments: store.equipments
  }
}

export default withRouter(connect(
  mapStateToProps,
  { removeEquipment, addUIMessage }
)(Equipments))