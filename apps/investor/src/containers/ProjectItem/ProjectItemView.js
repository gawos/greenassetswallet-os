import React, { PureComponent } from 'react'

import ProjectDetails from './ProjectDetails'
import Bonds from 'src/containers/Bonds'
import ProjectValidation from './ProjectValidation'
import ProjectImpact from './ProjectImpact'

import styles from './ProjectItem.module.css'

class ProjectItemView extends PureComponent {
  render() {
    const { project } = this.props

    const validationReports = project.reports.filter(({type}) => type === 'validationReport')
    const impactReports = project.reports.filter(({type}) => type === 'impactReport')

    const commitments = project.framework.commitments

    return (
      <div>
        <div className={styles.title}>Project Description</div>
        <ProjectDetails project={project} />
        <Bonds bonds={project.bonds} />
        <div className={styles.title}>Project Validation</div>
        <ProjectValidation
          reports={validationReports}
          commitments={commitments}
          projectId={project.tuid}
        />
        <div className={styles.title}>Project Impact</div>
        <ProjectImpact reports={impactReports} />
      </div>
    )
  }
}

export default ProjectItemView
