import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { graphql, compose } from 'react-apollo'
import { Spin, Card, Icon, Row, Col } from 'antd'
import transformProps from 'transform-props-with'

//app modules
import config from 'config/index'
import { user as userQuery } from 'src/queries/queries.gql'

import classStyles from 'src/containers/IssuerItem/Profile.module.css'
import appClassStyles from '../../App/App.module.css'

@withRouter
@transformProps(oldProps => {
  const { tuid, ...props } = oldProps

  return {
    tuid: tuid || props.match.params.tuid,
    ...props
  }
})
@compose(
  graphql(userQuery, {
    options: ({ tuid }) => ({
      variables: {
        tuid
      }
    }),
    name: `userQuery`
  })
)
export default class ValidatorsItem extends Component {
  create = () => {}

  render() {
    const { userQuery } = this.props
    if (userQuery.error) {
      return (
        <Fragment>
          Error!
          <div>{userQuery.error ? userQuery.error.message : null}</div>
        </Fragment>
      )
    }
    if (userQuery.loading) {
      return (
        <div
          style={{
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`
          }}
        >
          <Spin size="large" />
        </div>
      )
    }
    const { user } = userQuery
    const avatarData =
      user.auxData.avatar && user.auxData.avatar.length > 0
        ? user.auxData.avatar[0]
        : null

    return (
      <Fragment>
        <div className={appClassStyles.content}>
          <Card className={classStyles.profileContainer}>
            <div className={classStyles.profileTitle}>{user.name}</div>
          </Card>
        </div>
        <div className={appClassStyles.content}>
          <Card className={classStyles.profileContainer}>
            <Row>
              <Col span={8} className={classStyles.profileImg}>
                {avatarData ? (
                  <img
                    alt="avatar"
                    style={{ width: `100%`, marginBottom: '10px' }}
                    src={`${config.api}/upload/${avatarData.tuid}.${
                      avatarData.ext
                    }`}
                  />
                ) : (
                  <Icon
                    color="#41579C"
                    style={{ fontSize: '50px' }}
                    type="picture"
                    theme="outlined"
                  />
                )}
                {user.auxData.link && (
                  <a
                    className={classStyles.profileLink}
                    href={user.auxData.link}
                  >
                    <Icon color="#41579C" type="link" theme="outlined" />{' '}
                    {user.auxData.link}
                  </a>
                )}
              </Col>
              <Col span={16} className={classStyles.profileDescription}>
                {user.auxData.description && (
                  <div>
                    <div className={classStyles.title}>Company Description</div>
                    <div className={classStyles.value}>
                      {user.auxData.description}
                    </div>
                  </div>
                )}
                {user.auxData.greenObjectives && (
                  <div>
                    <div className={classStyles.title}>Green Objectives</div>
                    <div className={classStyles.value}>
                      {user.auxData.greenObjectives}
                    </div>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        </div>
      </Fragment>
    )
  }
}
