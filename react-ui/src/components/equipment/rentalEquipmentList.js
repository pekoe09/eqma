import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import RentalEquipmentItem from '../equipment/rentalEquipmentItem'
import { initializeEquipmentForRent } from '../../reducers/equipmentReducer'

class RentalEquipmentList extends React.Component {

  componentDidMount() {
    this.props.initializeEquipmentForRent()
  }

  render() {

    const columns = [
      {
        Header: '',
        accessor: 'rentalEquipmentItem',
        Cell: (row) => (
          <RentalEquipmentItem equipment={row.original} />
        ),
        sortable: false,
        filterable: false
      }
    ]

    const handleRowClick = (state, rowInfo, column) => {
      const history = this.props.history
      return {
        onClick: (e, handleOriginal) => {
          history.push(`/equipment/rentdetails/${rowInfo.original._id}`)
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
        <ViewHeader text={'Browse equipment for rent'} />
        <ReactTable
          data={this.props.equipments}
          columns={columns}
          getTrProps={handleRowClick}
          defaultPageSize={20}
          minRows={1}
          style={tableStyle}
        />
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  console.log('Store equipments')
  console.log(store.equipments)
  const equipments = store.equipments
  return {
    equipments
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    initializeEquipmentForRent
  }
)(RentalEquipmentList))