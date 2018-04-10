import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ReactTable from 'react-table'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Button } from 'semantic-ui-react'
import { removeUser } from '../../reducers/userReducer'

class Users extends React.Component {

  handleRemove = (id) => {
    this.props.removeUser(id)
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
          <Button negative basic className='mini' onClick={() =>
            this.handleRemove(row.original._id)}>Delete</Button>
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