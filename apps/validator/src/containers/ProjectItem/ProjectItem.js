import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'

import { Spin, Card } from 'antd'
import { graphql, compose } from 'react-apollo'

import TitleCard from 'src/_components/TitleCard'
import ProjectItemView from './ProjectItemView'

import { project as projectQuery } from 'src/queries/queries.gql'

import styles from './ProjectItem.module.css'

@withRouter
@compose(
  graphql(projectQuery, {
    options: ({ tuid, match }) => ({
      variables: {
        tuid: tuid || match.params.tuid
      }
    }),
    name: 'projectQuery'
  })
)
class ProjectItem extends Component {
  render() {
    const { projectQuery } = this.props

    if (projectQuery.error) {
      return (
        <Fragment>
          Error!
          <div>{projectQuery.error ? projectQuery.error.message : null}</div>
        </Fragment>
      )
    }
    if (projectQuery.loading) {
      return (
        <Fragment>
          <TitleCard title="Project" />
          <div className="content-wrapper">
            <Card className="empty-card">
              <Spin size="large" />
            </Card>
          </div>
        </Fragment>
      )
    }
    const { project } = projectQuery
    if (!project) {
      return (
        <Fragment>
          <TitleCard title="Project" />
          <div className="content-wrapper">
            <Card className="empty-card">
              Project does not exists or was removed
            </Card>
          </div>
        </Fragment>
      )
    }

    return (
      <Fragment>
        <TitleCard
          title={<div>
            <div className={styles.titleHeader}>Project</div>
            <div>{project.name}</div>
          </div>}
        />
        <div className="content-wrapper">
          <ProjectItemView project={project} />
        </div>
      </Fragment>
    )
  }
}

export default ProjectItem
