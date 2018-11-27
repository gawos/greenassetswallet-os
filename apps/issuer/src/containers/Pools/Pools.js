import React, { Component, Fragment } from 'react'
import { graphql } from 'react-apollo'
import { Table } from 'antd'

import PoolItem from 'src/containers/PoolItem'
import { pools as poolsQueryTmpl } from 'src/queries/queries.gql'

const { Column } = Table


@graphql(poolsQueryTmpl, {
  name: 'itemsQuery',
  options: ({ issuer }) => ({
    variables: {
      filter: {
        issuer
      }
    }
  })
})
class Pools extends Component {
  renderExpendedView = record => <PoolItem tuid={record.tuid} />;

  renderActions = (value, record) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <a
        href={`/pools/${record.tuid}`}
        className="ant-btn ant-btn-primary ant-btn-background-ghost"
        target="_blank"
        rel="noopener noreferrer"
      >
        open
      </a>
    </div>
  );

  renderTitle = (value, record) => (
    <Fragment>
      <div style={{ color: 'rgb(18, 56, 152)', fontSize: '24px' }}>
        {record.name}
      </div>
    </Fragment>
  );

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
        loading={itemsQuery.loading}
        rowKey="tuid"
        dataSource={itemsQuery.pools}
        expandedRowRender={this.renderExpendedView}
        pagination={{
          hideOnSinglePage: true
        }}
        style={{ width: '100%' }}
      >
        <Column title="ID" key={'tuid'} render={this.renderTitle} />
        <Column
          title="Name"
          key={'name'}
          dataIndex="name"
          sorter={(a, b) => a.name.localeCompare(b.name)}
        />

        <Column key={'actions'} render={this.renderActions} />
      </Table>
    )
  }
}

export default Pools
