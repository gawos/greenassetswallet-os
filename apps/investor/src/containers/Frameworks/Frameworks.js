import React, { Component, Fragment } from "react"
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import { graphql, compose } from "react-apollo"

import { Table } from "antd"

//app modules
import config from "config/index"

import FrameworkItem from "src/containers/FrameworkItem"
const { Column } = Table

@withRouter
class Frameworks extends Component {
  renderName = (value, record) => {
    return <img src={value} style={{ width: `80px`, height: `auto` }} />
  }

  renderFileLink = (value, record) => {
    return (
      <Fragment>
        <span>{record.filename}</span>
        <a
          href={`${config.api}/upload/${record.tuid}.${record.ext}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ paddingLeft: `10px` }}
        >
          Download
        </a>
      </Fragment>
    )
  }
  renderExpendedView = record => {
    return <FrameworkItem tuid={record.tuid} />
  }

  renderFrameworkInfo = (value, record, index) => (
    <Fragment>
      <div style={{ color: `rgb(18, 56, 152)`, fontSize: `24px` }}>
        {record.name}
      </div>
      {/*<div style={{ color: 'rgb(176, 177, 190)', fontSize: '12px' }}>*/}
      {/*{record.tuid}*/}
      {/*</div>*/}
    </Fragment>
  )

  renderActions = (value, record, index) => {
    return (
      <div style={{ display: `flex`, justifyContent: `flex-end` }}>
        <Link
          to={`/frameworks/${record.tuid}`}
          className="ant-btn ant-btn-primary ant-btn-background-ghost"
        >
          open
        </Link>
      </div>
    )
  }

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
        className="tableNoBorder tableNoHeader"
        title={this.props.title}
        loading={itemsQuery.loading}
        rowKey="tuid"
        dataSource={itemsQuery.frameworks}
        expandedRowRender={this.renderExpendedView}
        pagination={{
          hideOnSinglePage: true
        }}
      >
        <Column key={`view`} render={this.renderFrameworkInfo} />
        <Column
          key={`actions`}
          render={this.props.renderActions || this.renderActions}
        />
      </Table>
    )
  }
}

export default Frameworks
