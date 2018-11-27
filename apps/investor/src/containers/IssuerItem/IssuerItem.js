import React, { PureComponent, Fragment } from 'react'
import { withRouter } from 'react-router'
import { graphql, compose } from 'react-apollo'
import { Spin, Card, Icon, Row, Col, Button, Modal } from 'antd'
import { observer } from 'mobx-react'
import transformProps from 'transform-props-with'

import config from 'config/index'
import TitleCard from 'src/_components/TitleCard'
import Framework from 'src/containers/Framework'
import FrameworkImpact from 'src/containers/Framework/FrameworkImpact'
import BondsView from 'src/containers/Bonds/BondsView'
import ProjectsView from 'src/containers/Projects/ProjectsView'
import PortfolioChoose from 'src/containers/PortfolioChoose'

import {
  user as userQueryTmp
} from 'src/queries/queries.gql'

import styles from './Profile.module.css'

@withRouter
@observer
@transformProps(oldProps => {
  const { tuid, ...props } = oldProps

  return {
    tuid: tuid || props.match.params.tuid,
    ...props
  }
})
@compose(
  graphql(userQueryTmp, {
    options: ({ tuid }) => ({
      variables: {
        tuid
      }
    }),
    name: 'userQuery'
  })
)
class IssuerItem extends PureComponent {
  state = {
    modalVisible: false,
    bondTuid: null
  }

  toggleModal = () => this.setState({ modalVisible: !this.state.modalVisible })

  onToPortfolio = bondTuid => {
    this.toggleModal()
    this.setState({ bondTuid })
  }

  renderBondsActions = (item, { tuid }) => (
    <Button
      type="primary"
      htmlType="button"
      ghost
      onClick={() => this.onToPortfolio(tuid)}
    >
      add to portfolio
    </Button>
  )

  get renderBondsTitle() {
    return (
      <div className={styles.titleContainer}>
        <div className={styles.titleName}>Green Bonds</div>
      </div>
    )
  }

  get renderProjectsTitle() {
    return (
      <div className={styles.titleContainer}>
        <div className={styles.titleName}>All associated projects</div>
      </div>
    )
  }

  render() {
    const { userQuery} = this.props
    const { modalVisible, bondTuid } = this.state
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

    return (
      <Fragment>
        <TitleCard title={ user.name } />
        <div className="content-wrapper">
          <Card className={styles.profileContainer}>
            <Row>
              <Col span={8} className={styles.profileImg}>
                {avatarData ? (
                  <img
                    alt="avatar"
                    style={{ width: '100%', marginBottom: '10px' }}
                    src={`${config.api}/upload/${avatarData.tuid}.${
                      avatarData.ext
                    }`}
                  />
                ) : (
                  <Icon
                    color="#41579C"
                    style={{ fontSize: '50px', display: 'block' }}
                    type="picture"
                    theme="outlined"
                  />
                )}
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
                {/* <div className={appClassStyles.content}>
          <Card className={styles.profileContainer}>
            <div className={styles.profileTitle}>{user.name}</div>
          </Card>
        </div> */}    </Col>
            </Row>
          </Card>
          <Framework tuid={this.props.tuid} />
          <FrameworkImpact user={user}  className={styles.card} />
          <BondsView
            title={this.renderBondsTitle}
            className={styles.card}
            issuer={user.tuid}
            renderActions={this.renderBondsActions}
          />
          <ProjectsView
            title={this.renderProjectsTitle}
            className={styles.card}
            issuer={user.tuid}
          />
        </div>
        <Modal
          width={'94%'}
          title={null}
          visible={modalVisible}
          footer={null}
          onCancel={this.toggleModal}
        >
          <PortfolioChoose bondTuid={bondTuid} />
        </Modal>
      </Fragment>
    )
  }
}

export default IssuerItem
