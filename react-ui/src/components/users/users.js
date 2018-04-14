import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Button, Confirm } from 'semantic-ui-react'
import { removeUser } from '../../reducers/userReducer'

class Users extends React.Component {

  state = {
    openDeleteConfirm: false,
    rowToDelete: null
  }

  handleRemove = async (row, e) => {
    e.stopPropagation()
    this.setState({ openDeleteConfirm: true, rowToDelete: row })
  }

  handleConfirmedRemove = async () => {
    this.setState({ openDeleteConfirm: false, rowToDelete: null })
    await this.props.removeUser(this.state.rowToDelete._id)
  }

  handleCancelledRemove = () => {
    this.setState({ openDeleteConfirm: false, rowToDelete: null })
  }

  render() {

    const columns = [
      {
        Header: 'Username',
        accessor: 'username',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'First name',
        accessor: 'firstName',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: 'Last name',
        accessor: 'lastName',
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
        Header: 'Status',
        accessor: 'status',
        headerStyle: {
          textAlign: 'left'
        }
      },
      {
        Header: '',
        accessor: 'delete',
        Cell: (row) => (
          <Button negative basic className='mini' onClick={(e) =>
            this.handleRemove(row.original, e)}>Delete</Button>
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
          history.push(`/users/details/${rowInfo.original._id}`)
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
        <ViewHeader text={'User list'} />
        <LinkButton text={'Add a user'} to={'/users/create'} />
        <Confirm
          open={this.state.openDeleteConfirm}
          header='Deleting a user'
          content={`Deleting ${this.state.rowToDelete ? this.state.rowToDelete.username : ''}. The operation is permanent; are you sure?`}
          confirmButton='Yes, delete'
          onConfirm={this.handleConfirmedRemove}
          onCancel={this.handleCancelledRemove}
        />
        <ReactTable
          data={this.props.users}
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
    users: store.users
  }
}

export default withRouter(connect(
  mapStateToProps,
  { removeUser }
)(Users))