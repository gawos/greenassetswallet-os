import React, { Component, Fragment } from 'react'

import { Link } from 'react-router-dom'

import { Table } from 'antd'
//app modules

import ProjectItem from 'src/containers/ProjectItem'

const { Column } = Table

class Projects extends Component {
  renderExpendedView = ({ tuid }) => <ProjectItem tuid={tuid} />

  renderActions = (value, record) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link
          to={`/projects/${record.tuid}`}
          className="ant-btn ant-btn-primary ant-btn-background-ghost"
        >
          open
        </Link>
      </div>
    )
  }

  renderName = (value, record) => (
    <Fragment>
      <div style={{ color: 'rgb(18, 56, 152)', fontSize: '24px' }}>
        {record.name}
      </div>
      <div style={{ color: 'rgb(176, 177, 190)', fontSize: '12px' }}>
        {record.tuid}
      </div>
    </Fragment>
  )

  render() {
    const { itemsQuery } = this.props

    if (itemsQuery.error)
      return (
        <Fragment>
          Error!
          <div>{itemsQuery.error ? itemsQuery.error.message : null}</div>
        </Fragment>
      )

    return (
      <Table
        className="tableNoBorder"
        title={this.props.title}
        rowKey="tuid"
        loading={itemsQuery.loading}
        dataSource={itemsQuery.projects}
        pagination={{
          hideOnSinglePage: true
        }}
        expandedRowRender={
          this.props.isExpandable ? this.renderExpendedView : null
        }
      >
        <Column title="Name" key={'name'} render={this.renderName} />

        <Column key={'actions'} render={this.renderActions} />
      </Table>
    )
  }
}

export default Projects
