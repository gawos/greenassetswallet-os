import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Spin, Icon } from 'antd'
import { inject } from 'mobx-react'
import jwtDecode from 'jwt-decode'
import { graphql, compose } from 'react-apollo'

//app modules
import cssClasses from './UserActionsMenu.module.css'
import config from 'config/index'
import { user as userQueryTmp } from 'src/queries/queries.gql'

@inject('authStore')
@withRouter
@compose(
  graphql(userQueryTmp, {
    options: props => {
      const { tuid } = jwtDecode(props.authStore.user.jwt)
      return {
        variables: {
          tuid
        }
      }
    },
    name: 'userQuery'
  })
)
class Header extends Component {
  logout = () => {
    this.props.authStore.logout()
  }
  render() {
    const { userQuery } = this.props
    if (userQuery.error) {
      return (
        <Fragment>
          Error!
          <div>{userQuery.error ? userQuery.error.message : null}</div>
          <div onClick={this.logout} className={cssClasses.navLink}>
            <Icon type="logout" /> <span>Log out</span>
          </div>
        </Fragment>
      )
    }
    if (userQuery.loading) {
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

    const user = { auxData: {} }
    return (
      <div
        className={`${this.props.className}`}
        style={{
          ...this.props.style
        }}
      >
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
          {user.name}
        </div>
        {Boolean(user.auxData && user.auxData.avatar && user.auxData.avatar.length) && (
          <img
            alt="avatar"
            style={{ width: '100%' }}
            src={`${config.api}/upload/${user.avatar[0].tuid}.${
              user.avatar[0].ext
            }`}
          />
        )}
      </div>
    )
  }
}

export default Header
