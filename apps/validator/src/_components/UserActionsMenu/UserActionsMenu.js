import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { inject } from 'mobx-react'
import { Icon } from 'antd'

//app modules
import cssClasses from './UserActionsMenu.module.css'
import config from 'config/index'

@inject('authStore')
@withRouter
class Header extends Component {
  logout = () => {
    this.props.authStore.logout()
  }
  render() {
    const { user } = this.props.authStore
    return (
      <div
        className={`${this.props.className}`}
        style={{
          ...this.props.style
        }}
      >
        {/* <NavLink to="/notifications" className={cssClasses.navLink}>
          <Badge count={1} offset={[0, 14]}>
            <Icon type="notification" />
            <span>Notification</span>
          </Badge>
        </NavLink> */}
        {/* <NavLink to="/profile" className={cssClasses.navLink}>
          <Icon type="setting" /> <span>Settings</span>
        </NavLink> */}
        <div onClick={this.logout} className={cssClasses.navLink}>
          <Icon type="logout" /> <span>Log out</span>
        </div>
        <div
          style={{
            color: '#fff',
            fontSize: '17px',
            paddingLeft: '5px',
            paddingTop: '10px'
          }}
        >
          { user.name}
        </div>
        {Boolean(user.auxData && user.auxData.avatar.length) && (
          <img
            alt="avatar"
            style={{ width: '100%' }}
            src={`${config.api}/upload/${user.auxData.avatar[0].tuid}.${
              user.auxData.avatar[0].ext
            }`}
          />
        )}
      </div>
    )
  }
}

export default Header
