import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'

import { Icon, Spin, Card } from 'antd'
import { graphql, compose } from 'react-apollo'

import TitleCard from 'src/_components/TitleCard'
import ProjectItemView from './ProjectItemView'
import config from 'config/index'

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
  state = {
    triggerAddReportCategory: false
  }

  renderFileLink = (value, record) => {
    return (
      <Fragment>
        <a
          href={`${config.api}/upload/${record.tuid}.${record.ext}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ paddingLeft: '10px' }}
        >
          Download
        </a>
      </Fragment>
    )
  }

  renderFileTitle = (value) => {
    return (
      <Fragment>
        <Icon type="file-pdf" style={{ fontSize: 20, paddingRight: '10px' }} />
        <span>{value}</span>
      </Fragment>
    )
  }

  triggerAddReportCategory = value => {
    this.setState({
      triggerAddReportCategory:
        value !== undefined ? value : !this.state.triggerAddReportCategory
    })
  }

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
        <div className="empty-card">
          <Spin size="large" />
        </div>
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
