import React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'
import { Button } from 'semantic-ui-react'
import { removeEquipment } from '../reducers/equipmentReducer'

class Equipments extends React.Component {

  handleRemove = (id) => {
    this.props.removeEquipment(id)
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
        }
      },
      {
        Header: 'Rented by',
        accessor: 'timeUnit',
        style: {
          textAlign: 'center'
        }
      },
      {
        Header: '',
        accessor: 'delete',
        Cell: (row) => (
          <Button negative basic className='mini' onClick={() =>
            this.handleRemove(row.original._id)}>Delete</Button>
        )
      }
    ]

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

export default connect(
  mapStateToProps,
  { removeEquipment }
)(Equipments)