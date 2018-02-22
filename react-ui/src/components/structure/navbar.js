import React from 'react'
import { NavLink } from 'react-router-dom'
import { Dropdown, Menu } from 'semantic-ui-react'

const NavBar = () => (
  <Menu>
    <Menu.Header>
      EqMa
    </Menu.Header>
    <Dropdown item text='Equipment'>
      <Dropdown.Menu>
        <Dropdown.Header content='Equipment' />
        <Dropdown.Item><NavLink to='/equipment'>Browse</NavLink></Dropdown.Item>
        <Dropdown.Item><NavLink to='/equipment/create'>Create new</NavLink></Dropdown.Item>
        <Dropdown.Item><NavLink to='/equipment/services'>Services</NavLink></Dropdown.Item>
        <Dropdown.Divider/>
        <Dropdown.Header content='Asset transactions' />
        <Dropdown.Item><NavLink to='/assettransactions'>Browse</NavLink></Dropdown.Item>
        <Dropdown.Item><NavLink to='/assettransactions/create'>Create new</NavLink></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown item text='Reports'>
      <Dropdown.Menu>
        <Dropdown.Item><NavLink to='/reports/utilization'>Utilization</NavLink></Dropdown.Item>
        <Dropdown.Item><NavLink to='/reports/profitability'>Profitability</NavLink></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Dropdown item text='Basic data'>
      <Dropdown.Menu>
        <Dropdown.Item><NavLink to='/users'>Users</NavLink></Dropdown.Item>
        <Dropdown.Item><NavLink to='/branches'>Branches</NavLink></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <Menu.Menu position='right'>
      <Menu.Item>
        Signup
      </Menu.Item>
      <Menu.Item>
        Login
      </Menu.Item>
    </Menu.Menu>
  </Menu>
)

export default NavBar