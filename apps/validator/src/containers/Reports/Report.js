import React, { PureComponent } from 'react'
import { Card, Icon, Row, Col } from 'antd'
import config from 'config/index'

import styles from './Reports.module.css'

class Report extends PureComponent {
  getStatus = state => {
    switch (state) {
      case 'TO_REPORT':
        return (
          <div className={styles.status}>
            <Icon
              type="clock-circle"
              theme="outlined"
              style={{ fontSize: '18px', color: '#99A1B5', marginRight: '5px' }}
            />
            Pending
          </div>
        )
      case 'CANCELED':
        return <div>Canceled</div>
      default:
        return (
          <div className={`${styles.status} ${styles.primary}`}>
            <Icon
              type="check-circle"
              theme="filled"
              style={{ fontSize: '18px', marginRight: '5px' }}
            />
            Delivered
          </div>
        )
    }
  }

  render() {
    const { report } = this.props
    const files =
      report.certifications[0] &&
      report.certifications[0].data &&
      report.certifications[0].data['file']
    return (
      <Row type="flex" justify="space-between" gutter={24}>
        <Col span={13}>
          <div className={styles.titleValue}>Green Commitment</div>
          <div className={styles.value}>
            {report.commitment.commitment}
          </div>
          <div className={styles.titleValue}>Description</div>
          <div className={styles.value}>{report.aux.description}</div>
        </Col>
        <Col span={10}>
          <Card bordered={false} className={styles.card}>
            <Row type="flex" justify="space-between" gutter={24}>
              <Col span={24}>
                <div className={styles.titleValue}>Status</div>
                <div className={styles.value}>{this.getStatus(report.state)}</div>
              </Col>
              <Col span={24}>
                <div className={styles.titleValue}>Documents</div>
                <div className={styles.value}>
                  {!files
                    ? 'Not Delivered'
                    : files.value.map(file => (
                      <a
                        key={file.tuid}
                        className={styles.documentLink}
                        href={`${config.api}/upload/${file.tuid}.${file.ext}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon type="file-text" theme="outlined" /> {file.name}
                      </a>
                    ))}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }
}

export default Report
