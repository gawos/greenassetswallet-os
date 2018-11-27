import React, { PureComponent } from 'react'
import { Button } from 'antd'

import ProjectDetails from './ProjectDetails'
import Bonds from 'src/containers/Bonds'
import ProjectValidation from './ProjectValidation'
import ProjectImpact from './ProjectImpact'
import CreateValidationReportForm from 'src/containers/Reports/CreateValidationReportForm'
import CreateImpactReportForm from 'src/containers/Reports/CreateImpactReportForm'

import styles from './ProjectItem.module.css'

class ProjectItemView extends PureComponent {
  state = {
    createImpactReportModal: false,
    createValidationReportModal: false
  }

  toggleCreateValidationReportModal = () => this.setState({ createValidationReportModal: !this.state.createValidationReportModal })
  toggleCreateImpactReportModal = () => this.setState({ createImpactReportModal: !this.state.createImpactReportModal })

  render() {
    const { project } = this.props
    const { createValidationReportModal, createImpactReportModal } = this.state

    const validationReports = project.reports.filter(({type}) => type === 'validationReport')
    const impactReports = project.reports.filter(({type}) => type === 'impactReport')

    const commitments = project.framework.commitments

    return (
      <div>
        <div className={styles.title}>Project Description</div>
        <ProjectDetails project={project} />
        <div className={styles.title}>Associated Bonds</div>
        <Bonds poolTuid={project.poolTuid} />
        <div className={styles.title}>
          <div>Project Validation</div>
          <Button type="primary" ghost icon="plus" onClick={this.toggleCreateValidationReportModal}>
            New Validation Report
          </Button>
          {createValidationReportModal && <CreateValidationReportForm
            visible={createValidationReportModal}
            commitments={commitments}
            projectId={project.tuid}
            onCancel={this.toggleCreateValidationReportModal}
          />}
        </div>
        <ProjectValidation
          reports={validationReports}
          commitments={commitments}
          projectId={project.tuid}
        />
        <div className={styles.title}>
          <div>Project Impact</div>
          <Button type="primary" ghost icon="plus" onClick={this.toggleCreateImpactReportModal}>
            New Impact Report
          </Button>
          {createImpactReportModal && <CreateImpactReportForm
            visible={createImpactReportModal}
            projectId={project.tuid}
            onOk={this.toggleCreateImpactReportModal}
            onCancel={this.toggleCreateImpactReportModal}
          />}
        </div>
        <ProjectImpact reports={impactReports} />
      </div>
    )
  }
}

export default ProjectItemView
