import React from 'react'
import { connect } from 'react-redux'
import ReactTable from 'react-table'
import User from './user'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'

class Users extends React.Component {

  render() {

    const columns = [
      {
        Header: 'Username',
        accessor: 'username'
      },
      {
        Header: 'First name',
        accessor: 'firstName'
      },
      {
        Header: 'Last name',
        accessor: 'lastName'
      },
      {
        Header: 'Status',
        accessor: 'status'
      }
    ]

    const tableStyle = {
      marginTop: 10
    }

    return (
      <div>
        <ViewHeader text={'User list'} />
        <LinkButton text={'Add a user'} to={'/users/create'} />
        <ReactTable
          data={this.props.users}
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
    users: store.users
  }
}

export default connect(
  mapStateToProps
)(Users)