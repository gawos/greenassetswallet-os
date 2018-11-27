import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'
import PropTypes from 'prop-types'

import cssClasses from './Header.module.css'

class Header extends PureComponent {
  static propTypes = {
    to: PropTypes.string.isRequired,
    title: PropTypes.string
  }
  render() {
    const {to, title} = this.props
    const Actions = this.props.actions
    return (
      <div className={cssClasses.index}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Link to={to} className={cssClasses.link}>
            <Icon type="left" /> Back
          </Link>
          <h1 className={cssClasses.title}>{title}</h1>
        </div>
        <div>
          { Actions && <Actions/> }
        </div>
      </div>
    )
  }
}

export default Header
