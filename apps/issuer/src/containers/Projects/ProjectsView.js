import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Table, Card } from 'antd'

import ProjectItemView from 'src/containers/ProjectItem/ProjectItemView'
import { regions } from 'src/constants'

import styles from './Projects.module.css'

const { Column } = Table

class ProjectsView extends Component {


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

      <Card className={className} >
        <Table
          title={title}
          className="table"
          rowKey={(b, id) => id}
          loading={projectsQuery.loading}
          dataSource={projectsQuery.projects}
          pagination={{
            hideOnSinglePage: true
          }}

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
              <div className={styles.link}>
                {issuer.name}
              </div>
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
            render={(value, {amount, currency}) => `${amount} ${currency}`}
          />
          {renderActions && <Column
            align="right"
            render={renderActions}
          />}
        </Table>
      </Card>

    )
  }
}

export default ProjectsView