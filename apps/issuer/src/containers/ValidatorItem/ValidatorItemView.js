import React, { PureComponent } from 'react'
import { Card, Row, Col, Icon } from 'antd'

import config from 'config/index'

import styles from './ValidatorItem.module.css'

import emptyAvatar from 'static/images/EmptyImage.jpg'

class ValidatorItemView extends PureComponent {
  render() {
    const { validator } = this.props

    const avatarData =
      validator.auxData && validator.auxData.avatar && validator.auxData.avatar.length > 0
        ? validator.auxData.avatar[0]
        : null

    const avatarSrc = avatarData
      ? `${config.api}/upload/${avatarData.tuid}.${avatarData.ext}`
      : emptyAvatar

    return (
      <Card>
        <Row type="flex" justify="space-between" gutter={24}>
          <Col span={8}>
            <div>
              <img
                alt="avatar"
                style={{ width: '100%', marginBottom: '10px' }}
                src={avatarSrc}
              />
            </div>
            {validator.auxData.link && (
              <div>
                <a
                  className={styles.link}
                  href={validator.auxData.link}
                >
                  <Icon color="#41579C" type="link" theme="outlined" />{' '}
                  {validator.auxData.link}
                </a>
              </div>
            )}
          </Col>
          <Col span={16}>
            {validator.auxData.description && (
              <div>
                <div className={styles.titleValue}>Company Description</div>
                <div className={styles.value}>
                  {validator.auxData.description}
                </div>
              </div>
            )}
            {validator.auxData.greenObjectives && (
              <div>
                <div className={styles.titleValue}>Green Objectives</div>
                <div className={styles.value}>
                  {validator.auxData.greenObjectives}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Card>
    )
  }
}

export default ValidatorItemView
