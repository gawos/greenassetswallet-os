import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Card, Spin, Row, Col, Icon } from 'antd'

import { graphql, compose } from 'react-apollo'
import config from 'config/index'

import TitleCard from 'src/_components/TitleCard'
import ProjectItemView from 'src/containers/ProjectItem/ProjectItemView'
import ReportForm from './ReportForm'
import ReportData from './ReportData'

import { report as reportQuery } from 'src/queries/queries.gql'
import styles from './ReportItem.module.css'

@withRouter
@compose(
  graphql(reportQuery, {
    options: props => ({
      variables: {
        tuid: props.match.params.tuid
      }
    }),
    name: 'reportQuery'
  })
)
class ReportItem extends Component {
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
    const { reportQuery } = this.props

    if (reportQuery.error) {
      return (
        <Fragment>
          Error!
          <div>{reportQuery.error ? reportQuery.error.message : null}</div>
        </Fragment>
      )
    }

    if (reportQuery.loading) {
      return (
        <Fragment>
          <TitleCard title="Report" />
          <div className="content-wrapper">
            <Card className="empty-card">
              <Spin size="large" />
            </Card>
          </div>
        </Fragment>
      )
    }

    const { report } = reportQuery

    if (!report) {
      return (
        <Fragment>
          <TitleCard title="Report" />
          <div className="content-wrapper">
            <Card className="empty-card">
              Report does not exists or was removed
            </Card>
          </div>
        </Fragment>
      )
    }

    const files =
      report.certifications[0] &&
      report.certifications[0].data &&
      report.certifications[0].data['file']


    const certification = report.certifications.length
      ? report.certifications[0]
      : null

    return (
      <Fragment>
        <TitleCard title={report.name} />
        <div className="content-wrapper">
          <Card>
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
          </Card>
          <div className={styles.title}>Certification</div>
          <Card>
            {certification ? (
              <ReportData data={certification} />
            ) : (
              <ReportForm data={report} />
            )}
          </Card>
          <div className={styles.title}>Related Project</div>
          <Card>
            <div className={styles.title}>{report.project.name}</div>
            <ProjectItemView project={report.project} />
          </Card>
        </div>
      </Fragment>
    )
  }
}

export default ReportItem
