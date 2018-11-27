import React, { Component, Fragment } from 'react'
import { Card, Spin, Icon, Row, Col } from 'antd'
import { graphql, compose } from 'react-apollo'
import { inject, observer } from 'mobx-react'
import jwtDecode from 'jwt-decode'

import config from 'config/index'
import HeaderCard from 'src/_components/HeaderCard'
import LinkBtn from 'src/_components/LinkBtn'
import { user as userQueryTmp } from 'src/queries/queries.gql'

import emptyAvatar from 'static/images/EmptyImage.jpg'

import styles from './Profile.module.css'

@inject('authStore')
@observer
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
class Profile extends Component {
  get getHeaderAction() {
    const { userQuery } = this.props
    const { user } = userQuery
    const avatarData =
      user.auxData.avatar && user.auxData.avatar.length > 0
        ? user.auxData.avatar[0]
        : null

    return (
      <LinkBtn
        primary
        ghost
        size="sm"
        icon={
          !avatarData &&
          !user.auxData.description &&
          !user.auxData.greenObjectives
            ? 'plus'
            : 'edit'
        }
        to="/profile/edit"
        text={`${
          !avatarData &&
          !user.auxData.description &&
          !user.auxData.greenObjectives
            ? 'Create'
            : 'Edit'
        } profile`}
      />
    )
  }

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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
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

    const avatarSrc = avatarData
      ? `${config.api}/upload/${avatarData.tuid}.${avatarData.ext}`
      : emptyAvatar

    return (
      <Fragment>
        <HeaderCard title={user.name} actions={this.getHeaderAction} />
        <div className="content-wrapper">
          <Card className={styles.profileContainer}>
            <Row>
              <Col span={8} className={styles.profileImg}>
                <img
                  alt="avatar"
                  style={{ width: '100%', marginBottom: '10px' }}
                  src={avatarSrc}
                />
                {user.auxData.link && (
                  <a
                    className={styles.profileLink}
                    href={user.auxData.link}
                  >
                    <Icon color="#41579C" type="link" theme="outlined" />{' '}
                    {user.auxData.link}
                  </a>
                )}
              </Col>
              <Col span={16} className={styles.profileDescription}>
                {user.auxData.description && (
                  <div>
                    <div className={styles.title}>Company Description</div>
                    <div className={styles.value}>
                      {user.auxData.description}
                    </div>
                  </div>
                )}
                {user.auxData.greenObjectives && (
                  <div>
                    <div className={styles.title}>Green Objectives</div>
                    <div className={styles.value}>
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

export default Profile
