import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Confirm } from 'semantic-ui-react'
import { removeEquipmentUnit } from '../../reducers/equipmentUnitReducer'
import { addUIMessage } from '../../reducers/uiMessageReducer'

class EquipmentUnits extends React.Component {

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
    await this.props.removeEquipmentUnit(this.state.rowToDelete._id)
    this.props.addUIMessage(`Equipment unit ${name} deleted`, 'success', 10)
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false, rowToDelete: null })
  }

  render() {
    const columns = [
      {
        Header: 'Equipment',
        accessor: 'makeAndModel',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Type',
        accessor: 'equipmentTypeName',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Asset ID',
        accessor: 'assetID',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Registration',
        accessor: 'registration',
        headerStyle: {
          textAlign: 'left'
        }
      },
    ]

    const handleRowClick = (state, rowInfo, column, instance) => {
      const history = this.props.history
      return {
        onClick: (e, handleOriginal) => {
          history.push(`/equipmentunits/details/${rowInfo.original._id}`)
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
        <ViewHeader text={'Equipment unit list'} />
        <LinkButton text={'Add an equipment unit'} to={'/equipmentunits/create'} />
        <Confirm
          open={this.state.openDeleteConfirm}
          header='Deleting an equipment unit'
          content={`Deleting ${this.state.rowToDelete
            ? (this.state.rowToDelete.makeAndModel + ' ' + this.state.rowToDelete.registration)
            : ''}. The operation is permanent; are you sure?`}
          confirmButton='Yes, delete'
          onConfirm={this.handleConfirmedRemove}
          onCancel={this.handleCancelledRemove}
        />
        <ReactTable
          data={this.props.equipmentUnits}
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
    equipmentUnits: store.equipmentUnits.map(e => {
      return {
        _id: e._id,
        makeAndModel: e.equipment.makeAndModel,
        equipmentTypeName: e.equipment.equipmentType.name,
        assetID: e.assetID,
        registration: e.registration
      }
    })
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    removeEquipmentUnit,
    addUIMessage
  }
)(EquipmentUnits))