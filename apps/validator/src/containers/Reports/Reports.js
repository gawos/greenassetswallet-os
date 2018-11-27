import React, { PureComponent, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Form, Spin, Card, Table, Icon } from 'antd'
import { Link } from 'react-router-dom'

import { graphql, compose } from 'react-apollo'
import { inject, observer } from 'mobx-react'

import TitleCard from 'src/_components/TitleCard'
import LinkBtn from 'src/_components/LinkBtn'
import Report from './Report'

import { reports as reportsQuery } from 'src/queries/queries.gql'

import styles from './Reports.module.css'
const { Column } = Table

@withRouter
@inject('authStore')
@observer
@compose(
  graphql(reportsQuery, {
    options: props => ({
      variables: {
        filter: {
          type: 'validationReport',
          validator: props.authStore.user.tuid
        }
      }
    }),
    name: 'reportsQuery'
  })
)
@Form.create()
class Reports extends PureComponent {
  renderExpendedView = report => <Report report={report} />

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
    const { reportsQuery } = this.props

    if (reportsQuery.error) {
      return (
        <Fragment>
          Error!
          <div>{reportsQuery.error ? reportsQuery.error.message : null}</div>
        </Fragment>
      )
    }

    if (reportsQuery.loading) {
      return (
        <Fragment>
          <TitleCard title="Reports" />
          <div className="content-wrapper">
            <Card className="empty-card">
              <Spin size="large" />
            </Card>
          </div>
        </Fragment>
      )
    }

    const { reports } = reportsQuery

    if (!reports.length) {
      return (
        <Fragment>
          <TitleCard title="Reports" />
          <div className="content-wrapper">
            <Card className="empty-card">
              No Reports
            </Card>
          </div>
        </Fragment>
      )
    }
    return (
      <Fragment>
        <TitleCard title="Reports" />
        <div className="content-wrapper">
          <Card>
            <Table
              rowKey={(b, id) => id}
              dataSource={reports}
              pagination={{
                hideOnSinglePage: true
              }}
              expandedRowRender={this.renderExpendedView}
              rowClassName={(report, idx) => idx % 2 === 0 ? 'table-even' : 'table-odd'}
            >
              <Column
                title="NAME"
                dataIndex="name"
                render={(name, { tuid }) => (
                  <Link className={styles.link} to={`/reports/${tuid}`}>
                    {name}
                  </Link>
                )}
              />
              <Column
                title="Status"
                dataIndex="state"
                render={status => this.getStatus(status)}
              />
              <Column
                title="Project"
                dataIndex="project"
                align="right"
                render={({ name }) => name}
              />
              <Column
                title=""
                align="right"
                render={(_, { tuid, state }) => (
                  <LinkBtn
                    primary
                    ghost
                    icon={state === 'TO_REPORT' ? 'edit' : ''}
                    to={`/reports/${tuid}`}
                    text={state === 'TO_REPORT' ? 'Sign Report' : 'Open'}
                  />
                )}
              />
            </Table>
          </Card>
        </div>
      </Fragment>
    )
  }
}

export default Reports
