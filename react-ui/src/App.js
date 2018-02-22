import React from 'react'
import { Container } from 'semantic-ui-react'
import { Route, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { initializeUsers } from './reducers/userReducer'
import { initializeAssetTransactions } from './reducers/assetTransactionReducer'
import { initializeEquipment } from './reducers/equipmentReducer'
import NavBar from './components/structure/navbar'
import Users from './components/users'
import UserCreate from './components/userCreate'
import AssetTransactions from './components/assetTransactions'
import AssetTransactionsCreate from './components/assetTransactionCreate'
import Equipments from './components/equipments'
import EquipmentCreate from './components/equipmentCreate'

class App extends React.Component {

  componentDidMount = async () => {
    this.props.initializeUsers()
    this.props.initializeEquipment()
    this.props.initializeAssetTransactions()
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
        <Route exact path='/equipment' render={() => <Equipments />} />
        <Route exact path='/equipment/create' render={({ history }) =>
          <EquipmentCreate history={history} />}
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
    initializeAssetTransactions
  }
)(App))
