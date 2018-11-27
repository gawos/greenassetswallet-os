import React, { Component } from "react"
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import { Badge, Avatar, Menu, Dropdown } from "antd"
import { inject } from "mobx-react"

@inject(`authStore`)
@withRouter
class Header extends Component {
  handleOnClick = ({ item, key, keyPath }) => {
    switch (key) {
    case `logout`:
      this.props.authStore.logout()
      break
    default:
      break
    }
  }
  render() {
    return (
      <div style={{ marginRight: 24, cursor: `pointer` }}>
        <Dropdown
          overlay={
            <Menu onClick={this.handleOnClick}>
              <Menu.Item key="profile">
                <Link to={`/profile`}>Profile</Link>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="logout">Logout</Menu.Item>
            </Menu>
          }
          trigger={[`click`]}
        >
          <Badge count={0}>
            <Avatar shape="square" icon="user" />
          </Badge>
        </Dropdown>
      </div>
    )
  }
}

export default Header
