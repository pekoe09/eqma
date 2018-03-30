import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Label, Select, Button } from 'semantic-ui-react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { createAssetTransaction } from '../../reducers/assetTransactionReducer'

const typeOptions = [
  { key: 'Purchase', text: 'Purchase', value: 'Purchase' },
  { key: 'Sale', text: 'Sale', value: 'Sale' },
  { key: 'Scrapping', text: 'Scrapping', value: 'Scrapping' },
]

const formStyle = {
  marginTop: 10
}

class AssetTransactionCreate extends React.Component {

  state = {
    equipment: '',
    date: moment(),
    type: '',
    value: '',
    description: ''
  }

  handleChange = (event, { value }) => {
    if (event.target.name) {
      this.setState({ [event.target.name]: value })
    } else {
      this.setState({ equipment: value })
    }
  }

  handleTypeChange = (e, { value }) => {
    this.setState({ type: value })
  }

  handleDateChange = (date) => {
    this.setState({ date })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    const assetTransaction = {
      equipment: this.state.equipment,
      date: this.state.date,
      type: this.state.type,
      value: this.state.value,
      description: this.state.description
    }
    this.props.createAssetTransaction(assetTransaction)
    this.props.history.push('/assettransactions')
  }

  render() {
    return (
      <div>
        <ViewHeader text={'Add an asset transaction'} />
        <LinkButton text={'Cancel'} to={'/assettransactions'} type={'default'} />
        <Form style={formStyle} onSubmit={this.handleSubmit}>
          <Form.Field required control={Select} width={6} label='Equipment' name='equipment'
            options={this.props.equipments} value={this.state.equipment} onChange={this.handleChange} />
          <Form.Field width={4}>
            <label forname='date'>Date</label>
            <DatePicker
              name='date'
              selected={this.state.date}
              onChange={this.handleDateChange}
              todayButton={'Today'}
            />
          </Form.Field>
          <Form.Field required control={Select} width={6} label='Type' name='type'
            options={typeOptions} value={this.state.type} onChange={this.handleTypeChange} />
          <Form.Field required control={Input} width={6} label='Value' name='value'
            value={this.state.value} onChange={this.handleChange} />
          <Form.TextArea required width={12} rows={5} label='Description' name='description'
            value={this.state.description} onChange={this.handleChange} />
          <Form.Field>
            <Button primary>
              Save
            </Button>
          </Form.Field>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    equipments: store.equipments.map(e => {
      return {
        key: e._id,
        text: e.name,
        value: e._id
      }
    })
  }
}

export default withRouter(connect(
  mapStateToProps,
  { createAssetTransaction }
)(AssetTransactionCreate))