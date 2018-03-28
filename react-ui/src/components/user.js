import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from './structure/viewHeader'
import LinkButton from './structure/linkButton'
import { Form } from 'semantic-ui-react'

const formStyle = {
  marginTop: 10
}

class User extends React.Component {

  render() {
    const user = this.props.user
    return (
      <div>
        <ViewHeader text={`User ${user.fullName}`} />
        <LinkButton text={'To user list'} to={'/users'} type={'default'} />
        <LinkButton text={'Edit'} to={`/users/edit/${user._id}`} type={'primary'} />
        <Form style={formStyle}>
          <Form.Field>
            <label>First name</label>
            <p>{user.firstName ? user.firstName : '-'}</p>
          </Form.Field>
          <Form.Field>
            <label>Last name</label>
            <p>{user.lastName}</p>
          </Form.Field>
          <Form.Field>
            <label>Username</label>
            <p>{user.username}</p>
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <p>{user.email}</p>
          </Form.Field>
          <Form.Field>
            <label>Status</label>
            <p>{user.status}</p>
          </Form.Field>
        </Form>
      </div>
    )
  }

}

const mapStateToProps = (store, ownProps) => {
  const user = store.users.find(u => u._id === ownProps.match.params.id)
  return {
    user
  }
}

export default withRouter(connect(
  mapStateToProps
)(User))