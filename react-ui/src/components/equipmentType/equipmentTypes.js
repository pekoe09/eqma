import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Button, Confirm } from 'semantic-ui-react'
import { removeEquipmentType } from '../../reducers/equipmentTypeReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class EquipmentTypes extends React.Component {

  state = {
    openDeleteConfirm: false,
    rowToDelete: null
  }

  handleRemove = (row, e) => {
    e.stopPropagation()
    this.setState({ openDeleteConfirm: true, rowToDelete: row })
  }

  handleConfirmedRemove = async () => {
    const name = this.state.rowToDelete.name
    this.setState({ openDeleteConfirm: false, rowToDelete: null })
    await this.props.removeEquipmentType(this.state.rowToDelete._id)
    this.props.addUIMessage(`Equipment type ${name} deleted`, 'success', 10)
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
        Header: 'Parent type',
        accessor: 'parentName',
        headerStyle: {
          textAlign:'left'
        }
      }
    ]

    const handleRowClick = (state, rowInfo, column, instance) => {
      const history = this.props.history
      return {
        onClick: (e, handleOriginal) => {
          history.push(`/equipmenttypes/details/${rowInfo.original._id}`)
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
        <ViewHeader text={'Equipment type list'} />
        <LinkButton text={'Add an equipment type'} to={'/equipmenttypes/create'} />
        <Confirm
          open={this.state.openDeleteConfirm}
          header='Deleting an equipment type'
          content={`Deleting ${this.state.rowToDelete ? this.state.rowToDelete.name : ''}. The operation is permanent; are you sure?`}
          confirmButton='Yes, delete'
          onConfirm={this.handleConfirmedRemove}
          onCancel={this.handleCancelledRemove}
        />
        <ReactTable
          data={this.props.equipmentTypes}
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
    equipmentTypes: store.equipmentTypes.map(e => {
      return {
        _id: e._id,
        name: e.name,
        parentType: e.parentType,
        parentName: e.parentType ? e.parentType.name : ''
      }
    })
  }
}

export default withRouter(connect(
  mapStateToProps,
  { removeEquipmentType, addUIMessage }
)(EquipmentTypes))