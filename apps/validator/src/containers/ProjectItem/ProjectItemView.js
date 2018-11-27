import React, { PureComponent } from 'react'

import ProjectDetails from './ProjectDetails'
import Bonds from 'src/containers/Bonds'

import styles from './ProjectItem.module.css'

class ProjectItemView extends PureComponent {
  render() {
    const { project } = this.props

    return (
      <div>
        <div className={styles.title}>Project Description</div>
        <ProjectDetails project={project} />
        <div className={styles.title}>Associated Bonds</div>
        <Bonds poolTuid={project.poolTuid} isExpandable={true} />
      </div>
    )
  }
}

export default ProjectItemView
