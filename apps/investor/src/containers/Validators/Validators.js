import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Form, Table, Spin } from 'antd'

import { graphql, compose } from 'react-apollo'
//app modules
import { users as itemsQuery } from 'src/queries/queries.gql'

const { Column } = Table

@withRouter
@compose(
  graphql(itemsQuery, {
    name: `itemsQuery`,
    options: props => ({
      variables: {
        filter: { role: `validator` }
      }
    })
  })
)
@Form.create()
export default class Validators extends Component {
  static propTypes = {}

  expandRow = data => {
    return <pre>{JSON.stringify(data, null, 2)}</pre>
  }
  renderTitle = (value, record) => (
    <Fragment>
      <div style={{ color: `rgb(18, 56, 152)`, fontSize: `24px` }}>
        {record.name}
      </div>
    </Fragment>
  )
  renderActions = item => {
    return (
      <div style={{ display: `flex`, justifyContent: `flex-end` }}>
        <Link
          className="ant-btn ant-btn-primary ant-btn-background-ghost"
          to={`/validators/${item.tuid}`}
        >
          Open
        </Link>
      </div>
    )
  }

  render() {
    const { itemsQuery } = this.props
    if (itemsQuery.loading) {
      return (
        <div
          style={{
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
            height: `100%`
          }}
        >
          <Spin size="large" />
        </div>
      )
    }
    if (itemsQuery.error)
      return (
        <Fragment>
          Error!
          <div>{itemsQuery.error ? itemsQuery.error.message : null}</div>
        </Fragment>
      )

    return (
      <Table
        loading={itemsQuery.loading}
        pagination={{
          hideOnSinglePage: true
        }}
        rowKey="tuid"
        dataSource={itemsQuery.users}
      >
        <Column key="name" title="Name" render={this.renderTitle} />
        <Column key="actions" render={this.renderActions} />
      </Table>
    )
  }
}
