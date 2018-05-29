import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Form, Select, Input } from 'semantic-ui-react'
import RentalEquipmentItem from '../equipment/rentalEquipmentItem'
import { initializeEquipmentForRent } from '../../reducers/equipmentReducer'
import { initializeEquipmentTypes } from '../../reducers/equipmentTypeReducer'
import { setFilter } from '../../reducers/filterReducer'

class RentalEquipmentList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      equipmentType: '',
      priceFrom: 0,
      priceTo: 0
    }
  }

  componentDidMount() {
    this.setState({
      equipmentType: this.props.equipmentType ? this.props.equipmentType : '',
      priceFrom: this.props.priceFrom,
      priceTo: this.props.priceTo
    })
    this.props.initializeEquipmentForRent()
    this.props.initializeEquipmentTypes()
  }

  handleEquipmentTypeChange = (event, { value }) => {
    this.setState({ equipmentType: value }, () => {
      this.props.setFilter({
        key: 'equipmentType',
        value: this.state.equipmentType
      })
    })
  }

  handlePriceFromChange = (event, { value }) => {
    this.setState({ priceFrom: value }, () => {
      this.props.setFilter({
        key: 'priceFrom',
        value: this.state.priceFrom
      })
    })
  }

  handlePriceToChange = (event, { value }) => {
    this.setState({ priceTo: value }, () => {
      this.props.setFilter({
        key: 'priceTo',
        value: this.state.priceTo
      })
    })
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

    const handleRowClick = (state, rowInfo) => {
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
        <Form>
          <Form.Group>
            <Form.Select fluid label='Type' width={4} options={this.props.equipmentTypes}
              value={this.state.equipmentType} onChange={this.handleEquipmentTypeChange} />
            <Form.Input fluid label='Price from' width={2}
              value={this.state.priceFrom} onChange={this.handlePriceFromChange} />
            <Form.Input fluid label='Price to' width={2}
              value={this.state.priceTo} onChange={this.handlePriceToChange} />
          </Form.Group>
        </Form>
        <ReactTable
          data={this.props.equipments.filter(e => {
            return (
              (!this.props.equipmentType || e.equipmentType._id === this.props.equipmentType) &&
              (!this.props.priceFrom || e.price >= this.props.priceFrom) &&
              (!this.props.priceTo || e.price <= this.props.priceTo)
            )
          })}
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
  return {
    equipments: store.equipments,
    equipmentTypes: store.equipmentTypes.map(t => {
      return {
        key: t._id,
        text: t.name,
        value: t._id
      }
    }).sort().reverse().concat({ key: '', text: '<not selected>', value: '' }),
    equipmentType: store.filters.find(f => f.key === 'equipmentType').value,
    priceFrom: store.filters.find(f => f.key === 'priceFrom').value,
    priceTo: store.filters.find(f => f.key === 'priceTo').value
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    initializeEquipmentForRent,
    initializeEquipmentTypes,
    setFilter
  }
)(RentalEquipmentList))