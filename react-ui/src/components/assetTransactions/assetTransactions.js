import React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import moment from 'moment'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'

class AssetTransactions extends React.Component {

  render() {

    const columns = [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: row => (moment(row.original.date).format('L')),
        style: { textAlign: 'center' }
      },
      {
        Header: 'Type',
        accessor: 'type',
        style: { textAlign: 'center' }
      },
      {
        Header: 'Value',
        accessor: 'value',
        style: { textAlign: 'center' }
      },
      {
        Header: 'Asset ID',
        accessor: 'equipmentUnitAssetID',
        style: { textAlign: 'center' }
      },
      {
        Header: 'Asset make / model',
        accessor: 'equipmentMakeAndModel',
        style: { textAlign: 'center' },
        minWidth: 300
      }
    ]

    const tableStyle = {
      marginTop: 10,
      lineHeight: 2
    }

    return (
      <div>
        <ViewHeader text={'Asset transactions'} />
        <LinkButton text={'Add a transaction'} to={'/assettransactions/create'} />
        <ReactTable
          data={this.props.assetTransactions}
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
    assetTransactions: store.assetTransactions.map(t => {
      return {
        id: t._id,
        equipmentUnit: t.equipmentUnit._id,
        equipmentUnitAssetID: t.equipmentUnit.assetID,
        equipmentMakeAndModel: t.equipmentUnit.equipment.makeAndModel,
        date: t.date,
        type: t.type,
        value: t.value,
        description: t.description
      }
    })
  }
}

export default connect(
  mapStateToProps
)(AssetTransactions)