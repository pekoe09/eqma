import React from 'react'
import { Container } from 'semantic-ui-react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { initializeUsers } from './reducers/userReducer'
import { initializeAssetTransactions } from './reducers/assetTransactionReducer'
import { initializeCustomers } from './reducers/customerReducer'
import { initializeEquipment } from './reducers/equipmentReducer'
import { initializeRentals } from './reducers/rentalReducer'
import NavBar from './components/structure/navbar'

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
import Equipment from './components/equipment/equipment'
import Equipments from './components/equipment/equipments'
import EquipmentCreate from './components/equipment/equipmentCreate'
import EquipmentEdit from './components/equipment/equipmentEdit'
import Rentals from './components/rentals/rentals'
import RentalCreate from './components/rentals/rentalCreate'

class App extends React.Component {

  componentDidMount = async () => {
    this.props.initializeUsers()
    this.props.initializeEquipment()
    this.props.initializeAssetTransactions()
    this.props.initializeCustomers()
    this.props.initializeRentals()
  }

  render() {
    return (
      <Container>
        <NavBar />
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
  null,
  {
    initializeUsers,
    initializeEquipment,
    initializeAssetTransactions,
    initializeCustomers,
    initializeRentals
  }
)(App))
