import React, { PureComponent, Fragment } from 'react'
import { Card, Row, Col, Icon, Divider, Button } from 'antd'
import EditValidationReportForm from 'src/containers/Reports/EditValidationReportForm'

import config from 'config/index'

import styles from './ProjectItem.module.css'

class ProjectValidation extends PureComponent {
  state = {
    editValidation: false,
    report: null
  }

  toggleEditValidation = report => this.setState({ report, editValidation: !this.state.editValidation })

  getStatus = report => {
    switch (report.state) {
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

  renderReport = (report, idx, arr) => {
    const files =
      report.certifications[0] &&
      report.certifications[0].data &&
      report.certifications[0].data['file']
    return (
      <Fragment key={idx}>
        <Row type="flex" justify="space-between" gutter={24}>
          <Col span={13}>
            <div className={styles.reportName}>
              {report.aux.name} <Button shape="circle" icon="edit" size="small" type="primary" ghost onClick={() => this.toggleEditValidation(report)} />
            </div>
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
                <Col span={12}>
                  <div className={styles.titleValue}>Status</div>
                  <div className={styles.value}>{this.getStatus(report)}</div>
                </Col>
                <Col span={12}>
                  <div className={styles.titleValue}>Validator</div>
                  <div className={styles.value}>
                    {report.validatedBy.auxData.name}
                  </div>
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
        {idx < arr.length - 1 && <Divider />}
      </Fragment>
    )
  }

  render() {
    const { reports = [], commitments, projectId } = this.props
    const { report, editValidation } = this.state

    if (!reports.length) {
      return (
        <Card className="empty-card">
          Validations does not exists
        </Card>
      )
    }

    return (
      <Card>
        {reports.map((report, idx) =>
          this.renderReport(report, idx, reports)
        )}
        <EditValidationReportForm
          visible={editValidation}
          projectId={projectId}
          report={report}
          onCancel={() => this.toggleEditValidation()}
          commitments={commitments}
        />
      </Card>
    )
  }
}

export default ProjectValidation
