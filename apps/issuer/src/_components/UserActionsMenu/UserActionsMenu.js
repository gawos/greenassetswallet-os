import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { Spin, Icon } from 'antd'
import { inject } from 'mobx-react'
import { graphql, compose } from 'react-apollo'

//app modules
import cssClasses from './UserActionsMenu.module.css'
import { userMe as meQueryTmp } from 'src/queries/queries.gql'

@inject('authStore')
@withRouter
@compose(
  graphql(meQueryTmp, {
    name: 'meQueryTmp'
  })
)
class UserActionsMenu extends Component {
  logout = () => {
    this.props.authStore.logout()
  }
  render() {
    const { meQueryTmp } = this.props
    if (meQueryTmp.error) {
      return (
        <Fragment>
          Error!
          <div>{meQueryTmp.error ? meQueryTmp.error.message : null}</div>
        </Fragment>
      )
    }
    if (meQueryTmp.loading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Spin size="large" />
        </div>
      )
    }
    const { userMe: user } = meQueryTmp
    if (!user) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}
        >
          something wrong! cannot get your data
        </div>
      )
    }
    return (
      <div
        className={`${this.props.className}`}
        style={{
          ...this.props.style
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: '17px',
            paddingLeft: '5px',
            paddingTop: '10px'
          }}
        >
          {user.name}
        </div>
        <div
          style={{
            color: '#fff',
            fontSize: '17px',
            paddingLeft: '5px',
            paddingTop: '10px'
          }}
        >
          {user.email}
        </div>
        <br />
        <NavLink to="/profile" className={cssClasses.navLink}>
          <Icon type="setting" /> <span>Profile</span>
        </NavLink>
        <div onClick={this.logout} className={cssClasses.navLink}>
          <Icon type="logout" /> <span>Log out</span>
        </div>
      </div>
    )
  }
}

export default UserActionsMenu
