import React, { PureComponent } from 'react'
import { Layout } from 'antd'

import HeaderBack from 'src/_components/HeaderBack'
import ProjectItem from './ProjectItem'

import appStyles from 'src/App/App.module.css'

export default class ProjectItemLayout extends PureComponent {
  render() {
    return (
      <Layout className={appStyles.layout}>
        <HeaderBack to="/projects" title="Project details" />
        <ProjectItem {...this.props} />
      </Layout>
    )
  }
}
