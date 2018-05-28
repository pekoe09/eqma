import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ViewHeader from '../structure/viewHeader'
import LinkButton from '../structure/linkButton'
import { Form } from 'semantic-ui-react'

const formStyle = {
  marginTop: 10
}

class CustomerSelf extends React.Component {

  render() {
    const customer = this.props.customer

    if (customer) {
      return (
        <div>
          <ViewHeader text={'My information'} />
          <LinkButton text={'Home'} to={'/'} type={'default'} />

          <Form style={formStyle}>
            <Form.Field>
              <label>Last name</label>
              <p>{customer.lastName ? customer.lastName : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>First names</label>
              <p>{customer.firstNames ? customer.firstNames : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Company</label>
              <p>{customer.company ? customer.company : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Email</label>
              <p>{customer.email ? customer.email : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Phone</label>
              <p>{customer.phone ? customer.phone : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Street address</label>
              <p>{customer.billingAddress.street1 ? customer.billingAddress.street1 : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Street address 2</label>
              <p>{customer.billingAddress.street2 ? customer.billingAddress.street2 : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>ZIP code</label>
              <p>{customer.billingAddress.zip ? customer.billingAddress.zip : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>City</label>
              <p>{customer.billingAddress.city ? customer.billingAddress.city : '-'}</p>
            </Form.Field>
            <Form.Field>
              <label>Country</label>
              <p>{customer.billingAddress.country ? customer.billingAddress.country : '-'}</p>
            </Form.Field>
          </Form>
        </div>
      )
    } else {
      return <div></div>
    }
  }
}

const mapStateToProps = (store, ownProps) => {
  const customer = store.customers[0]
  return {
    customer
  }
}

export default withRouter(connect(
  mapStateToProps
)(CustomerSelf))