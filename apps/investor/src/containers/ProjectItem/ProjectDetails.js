import React, { PureComponent } from 'react'
import { Card, Row, Col, Icon } from 'antd'

import config from 'config/index'
import { regions, goals } from 'src/constants'

import styles from './ProjectItem.module.css'
import emptyImg from 'static/images/EmptyImage.jpg'
import location from 'static/images/Location.svg'

class ProjectDetails extends PureComponent {
  render() {
    const { project } = this.props

    const logoData =
      project.logo && project.logo.length > 0
        ? project.logo[0]
        : null

    const logoSrc = logoData
      ? `${config.api}/upload/${logoData.tuid}.${logoData.ext}`
      : emptyImg

    return (
      <Card>
        <Row type="flex" justify="space-between" gutter={24}>
          <Col span={13}>
            <div className={styles.titleValue}>About the Project</div>
            <div className={styles.value}>{project.description}</div>
            <Row gutter={24}>
              {project.files.map(file => (
                <Col span={24} key={file.tuid} className={styles.file}>
                  <a
                    className={styles.documentLink}
                    href={`${config.api}/upload/${file.tuid}.${file.ext}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon type="file-text" theme="outlined" /> {file.filename}
                  </a>
                </Col>
              ))}
            </Row>
            <div className={styles.titleValue}>Framework SDGs</div>
            <Row gutter={24} type="flex" align="middle">
              {project.framework.goals.map(goal => (
                <Col span={12} key={goal.tuid}>
                  <div className={styles.goal}>
                    <img alt="logo" src={goals[goal.tuid].logo} width="60" height="60" className={styles.goalImg} />
                    <div className={styles.goalText}>{goal.text}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
          <Col span={11} style={{ overflow: 'hidden' }}>
            <div className={styles.logo}>
              <img
                alt="logo"
                style={{ width: '100%', marginBottom: '10px' }}
                src={logoSrc}
              />
              <Card
                bodyStyle={{ padding: '5px 10px' }}
                className={styles.region}
              >
                <img alt="logo" src={location} /> {regions[project.region]}
              </Card>
            </div>
          </Col>
        </Row>
      </Card>
    )
  }
}

export default ProjectDetails
