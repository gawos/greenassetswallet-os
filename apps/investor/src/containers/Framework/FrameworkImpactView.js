import React, { PureComponent, Fragment } from 'react'
import { inject } from 'mobx-react'
import { graphql, compose } from 'react-apollo'
import { Card, Row, Col, Icon, Spin } from 'antd'
import { PieChart, Pie, Legend, Cell } from 'recharts'

import { indicators, REPORT_COLORS } from 'src/constants'

import {
  projectsReport as projectsReportQueryTmpl
} from 'src/queries/queries.gql'

import styles from './FrameworkImpact.module.css'

@inject('authStore')
@compose(
  graphql(projectsReportQueryTmpl, {
    options: ({ user, reportYear }) => ({
      variables: {
        filter: {
          reportsType: 'impactReport',
          issuer: user.tuid,
          reportYear
        }
      }
    }),
    name: 'projectsQuery'
  })
)
class FrameworkImpactView extends PureComponent {
  renderAllProjectsRegistered(isEveryProjectRegistered) {
    if (isEveryProjectRegistered) {
      return (
        <div className={styles.category}>
          All projects financed by the proceeds are registered in the Green
          Assets Wallet
        </div>
      )
    } else {
      return (
        <div className={styles.category}>
          Not all projects financed by the proceeds are registered in the Green
          Assets Wallet
        </div>
      )
    }
  }
  render() {
    const { statisticsFramework, className, framework, projectsQuery } = this.props
    if (projectsQuery.error) {
      return (
        <Fragment>
          Error!
          <div>{projectsQuery.error ? projectsQuery.error.message : null}</div>
        </Fragment>
      )
    }

    if (projectsQuery.loading) {
      return (
        <Card
          className={className}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '232px'
          }}
        >
          <Spin size="large" />
        </Card>
      )
    }

    const { projects = [] } = projectsQuery

    const data = [
      {
        name: 'reported',
        value: projects.filter(p => !!p.reports.length).length
      },
      {
        name: 'empty',
        value: projects.filter(p => !p.reports.length).length
      }
    ]

    return (
      <Card className={className}>
        <Row type="flex" justify="space-between" gutter={24}>
          <Col span={24}>
            <div className={styles.aggregatedTitleContainer}>
              <div className={styles.aggregatedTitle}>
                {this.renderAllProjectsRegistered(
                  framework.isEveryProjectRegistered
                )}
                <PieChart width={240} height={40}>
                  <Pie
                    cx={16}
                    innerRadius={15}
                    outerRadius={20}
                    data={data}
                    dataKey="value"
                  >
                    {data.map((d, idx) => (
                      <Cell
                        key={idx}
                        fill={REPORT_COLORS[idx % REPORT_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    content={({ payload }) =>
                      payload.map((p, idx) => {
                        if (p.value !== 'reported') return null
                        return (
                          <div key={idx} className={styles.legendItem}>
                            <div className={styles.legendTitle}>
                              Reporting on {p.payload.value} projects
                            </div>
                            {p.payload.value > 0 && (
                              <div className={styles.legendValue}>
                                Out of {projects.length} projects total (
                                {Math.round(p.payload.percent * 10000) / 100}
                                %)
                              </div>
                            )}
                          </div>
                        )
                      })
                    }
                  />
                </PieChart>
              </div>
              {/* {certifications.lastReport && (
                <div className={styles.aggregatedTitle}>
                  <Icon
                    type="edit"
                    theme="outlined"
                    style={{ fontSize: '16px' }}
                  />
                  &nbsp; Latest report submission by {user.name}
                  &nbsp;
                  {moment(certifications.lastReport).format('YYYY-MM-DD')}
                </div>
              )} */}
            </div>
          </Col>
          <Col span={12}>
            <Card bordered={false} className={styles.card}>
              <div className={styles.cardTitle}>
                {indicators.energy_generation}
              </div>
              <div className={styles.cardValue}>
                {statisticsFramework.energyGenration.value} {statisticsFramework.energyGenration.unit}
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false} className={styles.card}>
              <div className={styles.cardTitle}>
                {indicators.emission_avoidance}
              </div>
              <div className={styles.cardValue}>
                {statisticsFramework.emissionAvoidance.value} {statisticsFramework.emissionAvoidance.unit}
              </div>
            </Card>
          </Col>
          {/* <Col span={8}>
            <Card bordered={false} className={styles.card}>
              <div className={styles.cardTitle}>
                {indicators.energy_consumption}
              </div>
              <div className={styles.cardValue}>
                {statisticsFramework.energyConsumption.value} {statisticsFramework.energyConsumption.unit}
              </div>
            </Card>
          </Col> */}
        </Row>
      </Card>
    )
  }
}

export default FrameworkImpactView
