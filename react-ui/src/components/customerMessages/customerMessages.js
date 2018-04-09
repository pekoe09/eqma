import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import { Button } from 'semantic-ui-react'
import { removeCustomerMessage, updateCustomerMessage } from '../../reducers/customerMessageReducer'

class CustomerMessages extends React.Component {

  render() {

    const tableStyle = {
      marginTop: 10,
      lineHeight: 2
    }

    const messageCellStyle = {
      boxSizing: 'border-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }

    const columns = [
      {
        Header: 'Name',
        accessor: 'name',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Email',
        accessor: 'email',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Customer',
        accessor: 'customer',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Handler',
        accessor: 'handler',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Message',
        accessor: 'message',
        headerStyle: {
          textAlign: 'left'
        },
        style: messageCellStyle
      },
      {
        Header: '',
        accessor: 'pickup',
        Cell: (row) => (
          (!row.original.handler &&
            <Button positive basic className='mini' onClick={(e) =>
              handlePickup(row.original._id, e)}>Pick up</Button>) ||
          (row.original.handler &&
            <Button basic color='orange' className='mini' onClick={(e) =>
              handlePickup(row.original._id, e)}>Drop</Button>)
        ),
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
            handleRemove(row.original._id, e)}>Delete</Button>
        ),
        style: {
          textAlign: 'center'
        },
        maxWidth: 100
      }
    ]

    const handleRowClick = (state, rowInfo, column, instance) => {
      const history = this.props.history
      return {
        onClick: (e, handleOriginal) => {
          history.push(`/customermessages/details/${rowInfo.original._id}`)
          if (handleOriginal) {
            handleOriginal()
          }
        }
      }
    }

    const handleRemove = async (id, e) => {
      e.stopPropagation()
      await this.props.removeCustomerMessage(id)
    }

    const handlePickup = async (id, e) => {      
      e.stopPropagation()
      const message = findById(id)
      message.handler = this.props.user._id
      console.log('Picking up ', message)
      await this.props.updateCustomerMessage(message)
    }

    const handleDrop = async (id, e) => {
      e.stopPropagation()
      const message = findById(id)
      const { handler, ...updatedMessage} = message
      await this.props.updateCustomerMessage(updatedMessage)
    }

    const findById = (id) => {
      return this.props.customerMessages.find(m => m._id === id)
    }

    return (
      <div>
        <ViewHeader text={'Customer messages'} />
        <ReactTable
          data={this.props.customerMessages}
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
  const loginState = store.login
  return {
    customerMessages: store.customerMessages,
    user: loginState ? loginState.user : null
  }
}

export default withRouter(connect(
  mapStateToProps,
  {
    removeCustomerMessage,
    updateCustomerMessage
  }
)(CustomerMessages))