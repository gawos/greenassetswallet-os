import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { NavLink, Link } from 'react-router-dom'
//app modules

import cssClasses from './Header.module.css'
import UserAcionsMenu from 'src/_components/UserActionsMenu'
import logoSrc from 'static/images/gaw-logo.png'

@withRouter
class Header extends Component {
  render() {
    return (
      <div>
        <div className={cssClasses.index}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Link to={'/'}>
                <img alt="logo" src={logoSrc} style={{ height: '58px' }} />
              </Link>
            </div>
            <NavLink
              to={'/portfolios'}
              className={cssClasses.navLink}
              activeClassName={cssClasses.navLinkActive}
            >
              Portfolios
            </NavLink>
            <NavLink
              to={'/bonds'}
              className={cssClasses.navLink}
              activeClassName={cssClasses.navLinkActive}
            >
              Bonds
            </NavLink>
            <NavLink
              to={'/issuers'}
              className={cssClasses.navLink}
              activeClassName={cssClasses.navLinkActive}
            >
              Issuers
            </NavLink>
            {/* <NavLink
              to={`/validators`}
              className={cssClasses.navLink}
              activeClassName={cssClasses.navLinkActive}
            >
              Validators
            </NavLink> */}
          </div>
          <UserAcionsMenu />
        </div>
      </div>
    )
  }
}

export default Header
