import React, { PureComponent, Fragment } from 'react'
import { withRouter } from 'react-router'
import { NavLink, Link } from 'react-router-dom'
import { Icon } from 'antd'

//app modules

import cssClasses from './Sidebar.module.css'

import UserAcionsMenu from 'src/_components/UserActionsMenu'

import logoSrc from 'static/images/gaw-logo.png'

@withRouter
class Sidebar extends PureComponent {
  render() {
    return (
      <Fragment>
        <Link to={'/'} className={cssClasses.logoLink}>
          <img alt="logo" src={logoSrc} />
        </Link>
        <NavLink
          to={'/users'}
          className={cssClasses.navLink}
          activeClassName={cssClasses.navLinkActive}
        >
          <Icon type="team" />
          <div>Users</div>
        </NavLink>
        <UserAcionsMenu className={cssClasses.userAcionsMenu} />
      </Fragment>
    )
  }
}

export default Sidebar
