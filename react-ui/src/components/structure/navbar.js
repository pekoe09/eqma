import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { Button, Dropdown, Menu } from 'semantic-ui-react'
import Login from '../login/login'
import { logout } from '../../reducers/loginReducer'

const menuLogoStyle = {
  marginLeft: 5,
  marginTop: 4
}

const menuStyle = {
  marginTop: 5
}
const menuDropdownStyle = {
  height: 40,
  display: 'inline-block',
  alignSelf: 'flex-end'
}

const EquipmentDropdownStaff = () => (
  <Dropdown item text='Equipment' style={menuDropdownStyle}>
    <Dropdown.Menu>
      <Dropdown.Header content='Equipment' />
      <Dropdown.Item><NavLink to='/equipment'>Browse</NavLink></Dropdown.Item>
      <Dropdown.Item><NavLink to='/equipment/create'>Create new</NavLink></Dropdown.Item>
      <Dropdown.Item><NavLink to='/equipment/services'>Services</NavLink></Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Header content='Asset transactions' />
      <Dropdown.Item><NavLink to='/assettransactions'>Browse</NavLink></Dropdown.Item>
      <Dropdown.Item><NavLink to='/assettransactions/create'>Create new</NavLink></Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
)

const EquipmentDropdownOther = () => (
  <Dropdown item text='Equipment' style={menuDropdownStyle}>
    <Dropdown.Menu>
      <Dropdown.Header content='Equipment' />
      <Dropdown.Item><NavLink to='/equipment'>Browse</NavLink></Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
)

const CustomerDropdown = () => (
  <Dropdown item text='Customers' style={menuDropdownStyle}>
    <Dropdown.Menu>
      <Dropdown.Header content='Customers' />
      <Dropdown.Item><NavLink to='/customers'>Browse</NavLink></Dropdown.Item>
      <Dropdown.Item><NavLink to='/customers/create'>Create new</NavLink></Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Header content='Rentals' />
      <Dropdown.Item><NavLink to='/rentals'>Browse</NavLink></Dropdown.Item>
      <Dropdown.Item><NavLink to='/rentals/create'>Create new</NavLink></Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
)
const ReportDropdown = () => (
  <Dropdown item text='Reports' style={menuDropdownStyle}>
    <Dropdown.Menu>
      <Dropdown.Item><NavLink to='/reports/utilization'>Utilization</NavLink></Dropdown.Item>
      <Dropdown.Item><NavLink to='/reports/profitability'>Profitability</NavLink></Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
)

const BasicDataDropdown = () => (
  <Dropdown item text='Basic data' style={menuDropdownStyle}>
    <Dropdown.Menu>
      <Dropdown.Item><NavLink to='/users'>Users</NavLink></Dropdown.Item>
      <Dropdown.Item><NavLink to='/branches'>Branches</NavLink></Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
)

class NavBar extends React.Component {

  handleLogout = () => {
    this.props.logout()
  }

  render() {
    return (
      <Menu style={menuStyle}>
        <Menu.Header style={menuLogoStyle}>
          <img src='/img/eqma-logo-80_85.png' />
        </Menu.Header>
        {!this.props.loggedIn && <EquipmentDropdownOther />}
        {this.props.loggedIn && this.props.isStaff && <EquipmentDropdownStaff />}
        {this.props.loggedIn && this.props.isStaff && <CustomerDropdown />}
        {this.props.loggedIn && this.props.isStaff && <ReportDropdown />}
        {this.props.loggedIn && this.props.isAdmin && <BasicDataDropdown />}
        <Menu.Menu position='right'>
          <Menu.Item style={menuDropdownStyle}>
            Signup
      </Menu.Item>
          <Menu.Item>
            <Login />
          </Menu.Item>
          <Menu.Item>
            <Button onClick={this.handleLogout}>logout</Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}

const mapStateToProps = (store, ownProps) => {
  const loginState = store.login
  const isStaff = loginState.loggedIn && (loginState.user.status === 'admin' || loginState.user.status === 'user')
  const isAdmin = loginState.loggedIn && loginState.user.status === 'admin'
  const isCustomer = loginState.loggedIn && !isStaff
  return {
    user: loginState.user,
    isAdmin,
    isStaff,
    isCustomer,
    loggedIn: loginState.loggedIn
  }
}

export default withRouter(connect(
  mapStateToProps,
  { logout }
)(NavBar))