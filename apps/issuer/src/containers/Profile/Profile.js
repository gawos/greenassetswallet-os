import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Card, Spin, Icon, Row, Col } from 'antd'
import { graphql, compose } from 'react-apollo'
import { inject } from 'mobx-react'

import config from 'config/index'
import LinkBtn from 'src/_components/LinkBtn'
import Framework from 'src/containers/Framework'
import FrameworkImpact from 'src/containers/Framework/FrameworkImpact'
import TitleCard from 'src/_components/TitleCard'
import Bonds from 'src/containers/Bonds/Bonds'
import Projects from 'src/containers/Projects'

import emptyAvatar from 'static/images/EmptyImage.jpg'

import { userMe as userMeQueryTmp } from 'src/queries/queries.gql'

import styles from './Profile.module.css'

@withRouter
@inject('authStore')
@compose(
  graphql(userMeQueryTmp, {
    name: 'itemQuery'
  })
)
class Profile extends Component {

  state={
    year: null
  }

  get getHeaderActions() {
    const { itemQuery } = this.props
    const { userMe: user } = itemQuery
    const avatarData =
      user.auxData && user.auxData.avatar && user.auxData.avatar.length > 0
        ? user.auxData.avatar[0]
        : null

    return (
      <LinkBtn
        primary
        ghost
        size="sm"
        icon={
          !avatarData &&
          !user.auxData &&
          !user.auxData.description &&
          !user.auxData.greenObjectives
            ? 'plus'
            : 'edit'
        }
        to="/profile/edit"
        text={`${
          !avatarData &&
          !user.auxData &&
          !user.auxData.description &&
          !user.auxData.greenObjectives
            ? 'Create'
            : 'Edit'
        } profile`}
      />
    )
  }

  onChangeYear=(year)=>{
    this.setState({ year })
  }

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
    const { userMe: user } = itemQuery
    if (!user) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 48px)'
          }}
        >
          something wrong! cannot get your data
        </div>
      )
    }

    const avatarData =
      user.auxData && user.auxData.avatar && user.auxData.avatar.length > 0
        ? user.auxData.avatar[0]
        : null

    const avatarSrc = avatarData
      ? `${config.api}/upload/${avatarData.tuid}.${avatarData.ext}`
      : emptyAvatar

    return (
      <Fragment>
        <TitleCard
          title={ user.name }
          actions={this.getHeaderActions}
        />
        <div className="content-wrapper">
          <Card className={styles.profileContainer}>
            <Row>
              <Col span={8} className={styles.profileImg}>
                <img
                  alt="avatar"
                  style={{ width: '100%', marginBottom: '10px' }}
                  src={avatarSrc}
                />
                {user.auxData && user.auxData.link && (
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
                {user.auxData &&
                  user.auxData.description && (
                  <div>
                    <div className={styles.title}>
                          Company Description
                    </div>
                    <div className={styles.value}>
                      {user.auxData.description}
                    </div>
                  </div>
                )}
                {user.auxData &&
                    user.auxData.greenObjectives && (
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
          <Framework className={styles.card} />
          <FrameworkImpact year={this.state.year} onChangeYear={this.onChangeYear} user={user}  className={styles.card} />
          <Bonds title={() =>
            <div className={styles.titleContainer}>
              <div className={styles.titleName}>Green Bonds</div>
            </div>
          } className={styles.card} />
          <Projects title={()=>(
            <div className={styles.titleContainer}>
              <div className={styles.titleName}>All associated projects</div>
            </div>
          )} className={styles.card} />
        </div>
      </Fragment>
    )
  }
}

export default Profile
