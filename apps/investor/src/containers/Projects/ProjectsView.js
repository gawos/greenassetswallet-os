import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Table, Card } from 'antd'
import { compose, graphql } from 'react-apollo'

import { projects as projectsQueryTmpl } from 'src/queries/queries.gql'

import ProjectItem from 'src/containers/ProjectItem'
import { regions } from 'src/constants'

import styles from './Projects.module.css'

const { Column } = Table

@compose(
  graphql(projectsQueryTmpl, {
    name: 'projectsQuery',
    options: ({ issuer, poolTuid, poolNot }) => ({
      variables: {
        filter: {
          issuer,
          pool: poolTuid,
          pool_not: poolNot
        }
      }
    })
  })
)
class ProjectsView extends Component {
  renderExpendedView = ({ tuid }) => <ProjectItem tuid={tuid} />

  render() {
    const { projectsQuery, title, className, renderActions } = this.props

    if (projectsQuery.error)
      return (
        <Fragment>
          Error!
          <div>{projectsQuery.error ? projectsQuery.error.message : null}</div>
        </Fragment>
      )

    return (
      <Fragment>
        {title || null}
        <Card className={className}>
          <Table
            className="table"
            rowKey={(b, idx) => idx}
            loading={projectsQuery.loading}
            dataSource={projectsQuery.projects}
            pagination={{
              hideOnSinglePage: true
            }}
            expandedRowRender={
              this.props.isExpandable ? this.renderExpendedView : null
            }
            rowClassName={(project, idx) => idx % 2 === 0 ? 'table-even' : 'table-odd'}
          >
            <Column
              title="NAME"
              dataIndex="name"
              render={(name, { tuid }) => (
                <Link className={styles.link} to={`/projects/${tuid}`}>
                  {name}
                </Link>
              )}
            />
            <Column
              title="ISSUER"
              dataIndex="issuer"
              render={issuer => (
                <Link className={styles.link} to={`/issuers/${issuer.tuid}`}>
                  {issuer.name}
                </Link>
              )}
            />
            <Column
              title="REGION"
              dataIndex="region"
              render={region => regions[region] || region}
            />
            <Column
              title="AMOUNT HELD"
              dataIndex="amount"
              align={renderActions ? null : 'right'}
              render={(amount, project) => `${amount} ${project.currency}`}
            />
            {renderActions && <Column
              align="right"
              render={renderActions}
            />}
          </Table>
        </Card>
      </Fragment>
    )
  }
}

export default ProjectsView
