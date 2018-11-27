import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Card, Spin, Avatar } from 'antd'
import { graphql, compose } from 'react-apollo'
import moment from 'moment'

//app modules
import config from 'config/index'
import {
  user as itemQuery
  //reports as reportsQuery
} from 'src/queries/queries.gql'

@withRouter
@compose(
  graphql(itemQuery, {
    options: props => ({
      variables: {
        tuid: props.match.params.tuid
      }
    }),
    name: 'itemQuery'
  })
)
class UserView extends Component {
  render() {
    const { itemQuery } = this.props
    if (itemQuery.error) {
      return (
        <Fragment>
          Error!
          <div>{itemQuery.error ? itemQuery.error.message : null}</div>
        </Fragment>
      )
    }

    const { user } = itemQuery
    if (itemQuery.loading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 48px)'
          }}
        >
          <Spin size="large" />
        </div>
      )
    }

    return (
      <Card style={{ ...this.props.style }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingBottom: '10px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <div
                style={{
                  fontSize: '11px'
                }}
              >
                {user.tuid}
              </div>
              <div style={{ width: '10px' }} />
              <div
                style={{
                  color: 'orange',
                  fontWeight: '700',
                  fontSize: '18px'
                }}
              >
                <div >{user.role}</div>
              </div>
            </div>
            <div>
              <span
                style={{
                  paddingRight: '5px',
                  color: 'rgba(100,100,100)',
                  fontSize: '11px'
                }}
              >
                Created at:
              </span>
              <span style={{ color: 'rgba(21,21,21)' }}>
                {moment(user.createdAt).format('DD/MM/YYYY')}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              {(() => {
                const avatarData =
                  user.auxData.avatar && user.auxData.avatar.length > 0
                    ? user.auxData.avatar[0]
                    : null

                return avatarData ? (
                  <Avatar
                    size="large"
                    style={{ backgroundColor: '#87d068' }}
                    src={`${config.api}/upload/${avatarData.tuid}.${
                      avatarData.ext
                    }`}
                  />
                ) : (
                  <Avatar
                    size="large"
                    style={{ backgroundColor: '#87d068' }}
                    icon="user"
                  />
                )
              })()}
            </div>
            <div style={{ width: '10px' }} />
            <div style={{ fontSize: '18px' }}>{user.name}</div>
          </div>
          <div>
            <div>Contact details</div>
            <div style={{ fontSize: '18px' }}>{user.email}</div>
            <div style={{ fontSize: '18px' }}>{user.auxData.phone}</div>
          </div>
        </div>
      </Card>
    )
  }
}

export default UserView
