import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'
import PropTypes from 'prop-types'
//app modules

import cssClasses from './Header.module.css'

@withRouter
class Header extends Component {
  static propTypes = {
    to: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }
  render() {
    return (
      <div className={cssClasses.index}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Link to={this.props.to} className={cssClasses.link}>
            <Icon type="left" /> Back
          </Link>
          <h1 style={{ margin: 0 }}>{this.props.title}</h1>
        </div>
      </div>
    )
  }
}

export default Header
