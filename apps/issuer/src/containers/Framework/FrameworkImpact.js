import React, { Component, Fragment } from 'react'
import { Select, Spin, Card } from 'antd'
import { inject } from 'mobx-react'
import { graphql, compose } from 'react-apollo'

import { frameworks as frameworksQuery, statisticsFramework as statisticsFrameworkQuery } from 'src/queries/queries.gql'

import FrameworkImpactView from './FrameworkImpactView'

import styles from './FrameworkImpact.module.css'

const { Option } = Select

@inject('authStore')
@compose(
  graphql(frameworksQuery, {
    options: ({
      authStore : {
        user: {
          tuid: issuer
        }
      }
    }) => {
      return {
        variables: {
          filter: {
            issuer
          }
        }
      }
    },
    name: 'frameworksQuery'
  }),
  graphql(statisticsFrameworkQuery, {
    skip: ({ frameworksQuery }) => !frameworksQuery.frameworks || !frameworksQuery.frameworks.length,
    options: ({
      frameworksQuery: {
        frameworks
      }, year }) => {
      return {
        variables: {
          framework: frameworks[0].tuid,
          year
        }
      }
    },
    name: 'statisticsFrameworkQuery'
  })
)

class FrameworkImpact extends Component {
  render() {
    const { className, user,  frameworksQuery, statisticsFrameworkQuery } = this.props

    if (frameworksQuery.loading) {
      return (
        <div><Spin size="large" /></div>
      )
    }

    const framework = frameworksQuery.frameworks[0]
    if(!framework) {
      return (<Fragment>
        <div className={styles.titleContainer}>
          <div className={styles.title}>Framework Impact</div>
        </div>
        <Card className={`empty-card ${className}`}>
          Framework does not exist
        </Card>
      </Fragment>)
    }

    if (statisticsFrameworkQuery.loading) {
      return (
        <div><Spin size="large" /></div>
      )
    }
    const { statisticsFramework } = statisticsFrameworkQuery
    return (
      <Fragment>
        <div className={styles.titleContainer}>
          <div className={styles.title}>Framework Impact</div>
          <div>
            <Select
              onChange={this.props.onChangeYear}
              defaultValue={null}
              style={{ width: '150px' }}
            >
              <Option value={null}>All time</Option>
              {statisticsFramework.reportedYears.map(year => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <FrameworkImpactView
          framework={framework}
          statisticsFramework={statisticsFramework}
          className={className}
          user={user}
          reportYear={this.props.year}
        />
      </Fragment>
    )
  }
}

export default FrameworkImpact
