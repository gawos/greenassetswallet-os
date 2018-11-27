import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Form, Spin, List, Card } from 'antd'

import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'

//app modules
import Report from './Report'

import { reports as reportsQuery } from 'src/queries/queries.gql'

import cssClasses from './ReportCategory.module.css'

@withRouter
@graphql(reportsQuery, {
  name: 'reportsQuery',
  options: props => {
    let variables = {}
    if (props.projectId) {
      variables.filter = [{ field: 'project', value: props.projectId }]
    }
    return {
      variables
    }
  }
})
@Form.create()
class ProjectReportCategoriesList extends Component {
  static propTypes = {
    projectId: PropTypes.string.isRequired
  }

  onRemove = () => {}

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
