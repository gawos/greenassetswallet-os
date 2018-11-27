import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Form, Spin, List, Card } from 'antd'

import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'

import Report from './Report'
import { reportCancel as reportCancelTmpl } from 'src/queries/mutations.gql'
import { reports as reportsQuery } from 'src/queries/queries.gql'

import cssClasses from './ReportCategory.module.css'

@withRouter
@compose(
  graphql(reportsQuery, {
    name: 'reportsQuery',
    options: props => {
      let variables = {}
      if (props.projectId) {
        variables.filter = { project: props.projectId }
      }
      return {
        variables
      }
    }
  }),
  graphql(reportCancelTmpl, {
    name: 'reportCancel'
  })
)
@Form.create()
class ProjectReportCategoriesList extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired
  }

  onRemove = () => {}

  onCancel = async tuid => {
    const { reportCancel } = this.props
    let variables = {}
    if (this.props.projectId) {
      variables.filter = { project: this.props.projectId }
    }
    await reportCancel({
      variables: {
        tuid
      },
      refetchQueries: [
        {
          query: reportsQuery,
          variables
        }
      ]
    })
  }

  render() {
    const { reportsQuery } = this.props

    if (reportsQuery.error)
      return (
        <Fragment>
          Error!
          <div>{reportsQuery.error ? reportsQuery.error.message : null}</div>
        </Fragment>
      )
    if (reportsQuery.loading)
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Spin size="large" />
        </div>
      )
    if (!reportsQuery.reports.length) {
      return (
        <div style={{ textAlign: 'center', fontSize: '20px' }}>no reports</div>
      )
    }

    const validationReports = reportsQuery.reports.filter(({type}) => type === 'validationReport')
    const impactReports = reportsQuery.reports.filter(({type}) => type === 'impactReport')

    return (
      <Fragment>
        {validationReports.length ? <div className={cssClasses.title}>Validation Reports</div> : null}
        {validationReports.length ? (
          <Card className={cssClasses.reportCard}>
            <List
              dataSource={validationReports}
              renderItem={item => (
                <List.Item key={item.tuid}>
                  <Report
                    onRemove={this.onRemove}
                    onCancel={this.onCancel}
                    data={item}
                  />
                </List.Item>
              )}
            >
            </List>
          </Card>
        ) : null}

        {impactReports.length ? <div className={cssClasses.title}>Impact Reports</div> : null}
        {impactReports.length ? (
          <Card className={cssClasses.reportCard}>
            <List
              dataSource={impactReports}
              renderItem={item => (
                <List.Item key={item.tuid}>
                  <Report
                    onRemove={this.onRemove}
                    onCancel={this.onCancel}
                    data={item}
                  />
                </List.Item>
              )}
            >
            </List>
          </Card>
        ) : null}
      </Fragment>
    )
  }
}

export default ProjectReportCategoriesList
