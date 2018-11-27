import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
//app modules

import cssClasses from './Header.module.css'

import logoSrc from 'static/images/gaw-logo.png'

const Header = (props) => {
  return (
    <div>
      <div className={cssClasses.index}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            alignContent: 'center'
          }}
        >
          <Link to={'/'}>
            <img alt="logo" src={logoSrc} style={{ height: '50px' }} />
          </Link>
          <Link
            to={props.to}
            className={cssClasses.navLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center'
            }}
          >
            <Icon type="left" /> Back
          </Link>
          <h1 className={cssClasses.title}>{props.title}</h1>
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
}

export default Header
