import React, { PureComponent, Fragment } from 'react'
import { Card, Table } from 'antd'
import { Link } from 'react-router-dom'

import { regions } from 'src/constants'

import classStyles from './Projects.module.css'

const { Column } = Table

export default class Projects extends PureComponent {
  render() {
    const { projects, withAmount, actions, className, loading, sorted } = this.props
    if (loading)
      return (
        <Fragment>
          <div className={classStyles.title}>Projects</div>
          <Card className={className} loading={true} />
        </Fragment>
      )
    if (!projects || !projects.length)
      return (
        <Fragment>
          <div className={classStyles.title}>Projects</div>
          <Card className={className}>
            <div style={{ textAlign: 'center', fontSize: '20px' }}>
              No projects found
            </div>
          </Card>
        </Fragment>
      )

    return (
      <Fragment>
        <div className={classStyles.titleContainer}>
          <div className={classStyles.title}>Projects</div>
          {actions}
        </div>
        <Card className={className}>
          <Table
            className={classStyles.table}
            rowKey={(b, idx) => idx}
            dataSource={projects}
            pagination={false}
            rowClassName={(project, idx) =>
              idx % 2 === 0 ? classStyles.even : classStyles.odd
            }
          >
            <Column
              title="NAME"
              dataIndex="name"
              render={(name, { tuid }) => (
                <Link to={`/projects/${tuid}`}>{name}</Link>
              )}
              sorter={sorted && ((a, b) => {
                if(a.name.toLowerCase() < b.name.toLowerCase()) { return 1 }
                if(a.name.toLowerCase() > b.name.toLowerCase()) { return -1 }
                return 0
              })}
            />
            <Column
              title="REGION"
              dataIndex="region"
              render={region =>
                regions[region] ? regions[region] : 'not region'
              }
              align={withAmount ? 'center' : 'right'}
              sorter={sorted && ((a, b) => {
                if(a.region.toLowerCase() < b.region.toLowerCase()) { return 1 }
                if(a.region.toLowerCase() > b.region.toLowerCase()) { return -1 }
                return 0
              })}
            />
            {withAmount && (
              <Column
                title="AMOUNT INVESTED"
                dataIndex="amount"
                render={(amount, { currency }) =>
                  `${amount} ${currency.toUpperCase()}`
                }
                align="right"
                sorter={sorted && ((a, b) => {
                  if(a.amount < b.amount) { return 1 }
                  if(a.amount > b.amount) { return -1 }
                  return 0
                })}
              />
            )}
          </Table>
        </Card>
      </Fragment>
    )
  }
}
