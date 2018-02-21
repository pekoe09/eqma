import React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'

class Equipments extends React.Component {

  render() {

    const columns = [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Make and model',
        accessor: 'makeAndModel'
      },
      {
        Header: 'Rate',
        accessor: 'price'
      },
      {
        Header: 'Rented by',
        accessor: 'timeUnit'
      }
    ]

    const tableStyle = {
      marginTop: 10
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
  mapStateToProps
)(Equipments)