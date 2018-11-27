import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Form, Card } from 'antd'

import PropTypes from 'prop-types'

//app modules

import cssClasses from './User.module.css'

@withRouter
@Form.create()
class User extends Component {
  static propTypes = {
    onRemove: PropTypes.func.isRequired
  }

  render() {
    return (
      <Card
        className={cssClasses.index}
        style={{
          border: '1px solid rgba(100,100,100, 0.5)',
          ...(this.props.style || {})
        }}
      />
    )
  }
}

export default User
