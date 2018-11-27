import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Form, Table, Card } from 'antd'

import PropTypes from 'prop-types'

//app modules

import cssClasses from './Users.module.css'

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

// Name

// write a name
// Identifier

// write an identifier
// Description

// textarea
// Validator

// write a report
// Type

export default User
