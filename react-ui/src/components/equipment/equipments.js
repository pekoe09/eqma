import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Button } from 'semantic-ui-react'
import { removeEquipment } from '../../reducers/equipmentReducer'

class Equipments extends React.Component {

  handleRemove = async (id, e) => {
    e.stopPropagation()
    await this.props.removeEquipment(id)
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
  { removeEquipment }
)(Equipments))