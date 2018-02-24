import React from 'react'
import { NavLink } from 'react-router-dom'
import { Dropdown, Menu } from 'semantic-ui-react'

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

const NavBar = () => (
  <Menu style={menuStyle}>
    <Menu.Header style={menuLogoStyle}>
      <img src='/img/eqma-logo-80_85.png' />
    </Menu.Header>
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
    <Dropdown item text='Customers' style={menuDropdownStyle}>
      <Dropdown.Menu>
        <Dropdown.Item><NavLink to='/customers'>Browse</NavLink></Dropdown.Item>
        <Dropdown.Item><NavLink to='/customers/create'>Create new</NavLink></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown item text='Reports' style={menuDropdownStyle}>
      <Dropdown.Menu>
        <Dropdown.Item><NavLink to='/reports/utilization'>Utilization</NavLink></Dropdown.Item>
        <Dropdown.Item><NavLink to='/reports/profitability'>Profitability</NavLink></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown item text='Basic data' style={menuDropdownStyle}>
      <Dropdown.Menu>
        <Dropdown.Item><NavLink to='/users'>Users</NavLink></Dropdown.Item>
        <Dropdown.Item><NavLink to='/branches'>Branches</NavLink></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Menu.Menu position='right'>
      <Menu.Item style={menuDropdownStyle}>
        Signup
      </Menu.Item>
      <Menu.Item style={menuDropdownStyle}>
        Login
      </Menu.Item>
    </Menu.Menu>
  </Menu>
)

export default NavBar