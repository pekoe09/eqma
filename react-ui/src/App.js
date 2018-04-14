import React from 'react'
import { Container } from 'semantic-ui-react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import NavBar from './components/structure/navbar'
import UIMessages from './components/structure/uiMessages'

import User from './components/users/user'
import Users from './components/users/users'
import UserCreate from './components/users/userCreate'
import UserEdit from './components/users/userEdit'
import AssetTransactions from './components/assetTransactions/assetTransactions'
import AssetTransactionsCreate from './components/assetTransactions/assetTransactionCreate'
import Customer from './components/customers/customer'
import Customers from './components/customers/customers'
import CustomerCreate from './components/customers/customerCreate'
import CustomerEdit from './components/customers/customerEdit'
import CustomerMessages from './components/customerMessages/customerMessages'
import CustomerMessageEdit from './components/customerMessages/customerMessageEdit'
import Equipment from './components/equipment/equipment'
import Equipments from './components/equipment/equipments'
import EquipmentCreate from './components/equipment/equipmentCreate'
import EquipmentEdit from './components/equipment/equipmentEdit'
import Rentals from './components/rentals/rentals'
import RentalCreate from './components/rentals/rentalCreate'
import ContactView from './components/contact/contactView'
import StoreHome from './components/structure/storeHome'

class App extends React.Component {

  render() {
    return (
      <Container>
        <NavBar />
        <UIMessages />

        <Route exact path='/' render={() => <StoreHome />} />
        <Route exact path='/contact' render={() => <ContactView />} />

        <Route exact path='/users' render={() => <Users />} />
        <Route exact path='/users/create' render={() => <UserCreate />} />
        <Route exact path='/users/edit/:id' render={() => <UserEdit />} />
        <Route exact path='/users/details/:id' render={() => <User />} />

        <Route exact path='/assettransactions' render={() => <AssetTransactions />} />
        <Route exact path='/assettransactions/create' render={() => <AssetTransactionsCreate />} />

        <Route exact path='/customers' render={() => <Customers />} />
        <Route exact path='/customers/create' render={() => <CustomerCreate />} />
        <Route exact path='/customers/details/:id' render={() => <Customer />} />
        <Route exact path='/customers/edit/:id' render={() => <CustomerEdit />} />

        <Route exact path='/customermessages' render={() => <CustomerMessages />} />
        <Route exact path='/customermessages/edit/:id' render={() => <CustomerMessageEdit />} />

        <Route exact path='/equipment' render={() => <Equipments />} />
        <Route exact path='/equipment/create' render={() => <EquipmentCreate />} />
        <Route exact path='/equipment/edit/:id' render={() => <EquipmentEdit />} />
        <Route exact path='/equipment/details/:id' render={() => <Equipment />} />

        <Route exact path='/rentals' render={() => <Rentals />} />
        <Route exact path='/rentals/create' render={() => <RentalCreate />}
        />
      </Container>
    )
  }
}

export default withRouter(connect(
  null
)(App))
