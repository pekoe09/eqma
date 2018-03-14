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

import Users from './components/users'
import UserCreate from './components/userCreate'
import AssetTransactions from './components/assetTransactions'
import AssetTransactionsCreate from './components/assetTransactionCreate'
import Customer from './components/customer'
import Customers from './components/customers'
import CustomerCreate from './components/customerCreate'
import CustomerEdit from './components/customerEdit'
import Equipment from './components/equipment'
import Equipments from './components/equipments'
import EquipmentCreate from './components/equipmentCreate'
import EquipmentEdit from './components/equipmentEdit'
import Rentals from './components/rentals'
import RentalCreate from './components/rentalCreate'

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
        <Route exact path='/users' render={({ history }) =>
          <Users history={history} />} />
        <Route exact path='/users/create' render={({ history }) =>
          <UserCreate history={history} />}
        />
        <Route exact path='/assettransactions' render={() => <AssetTransactions />} />
        <Route exact path='/assettransactions/create' render={({ history }) =>
          <AssetTransactionsCreate history={history} />}
        />
        <Route exact path='/customers' render={(history) =>
          <Customers history={history} />} />
        <Route exact path='/customers/create' render={({ history }) =>
          <CustomerCreate history={history} />} />
        <Route exact path='/customers/details/:id' render={() => <Customer />} />
        <Route exact path='/customers/edit/:id' render={() => <CustomerEdit />} />
        <Route exact path='/equipment' render={() => <Equipments />} />
        <Route exact path='/equipment/create' render={({ history }) =>
          <EquipmentCreate history={history} />}
        />
        <Route exact path='/equipment/edit/:id' render={() => <EquipmentEdit />} />
        <Route exact path='/equipment/details/:id' render={() => <Equipment />} />
        <Route exact path='/rentals' render={() => <Rentals />} />
        <Route exact path='/rentals/create' render={({ history }) =>
          <RentalCreate history={history} />}
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
