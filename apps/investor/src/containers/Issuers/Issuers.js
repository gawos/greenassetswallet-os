import React, { PureComponent, Fragment } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Form, Table, Spin, Card } from 'antd'

import { graphql, compose } from 'react-apollo'

import { users as itemsQuery } from 'src/queries/queries.gql'

import styles from './Issuers.module.css'

const { Column } = Table

@withRouter
@compose(
  graphql(itemsQuery, {
    name: 'itemsQuery',
    options: () => ({
      variables: {
        filter: { role: 'issuer' }
      }
    })
  })
)
@Form.create()
class Issuers extends PureComponent {
  static propTypes = {};

  expandRow = data => {
    return <pre>{JSON.stringify(data, null, 2)}</pre>
  };
  renderTitle = (value, record) => (
    <Fragment>
      <div style={{ color: 'rgb(18, 56, 152)', fontSize: '24px' }}>
        {record.name}
      </div>
    </Fragment>
  );
  renderActions = item => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link
          className="ant-btn ant-btn-primary ant-btn-background-ghost"
          to={`/issuers/${item.tuid}`}
        >
          Open
        </Link>
      </div>
    )
  };

  render() {
    const { itemsQuery } = this.props
    if (itemsQuery.loading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
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
      <Card>
        <Table
          loading={itemsQuery.loading}
          pagination={{
            hideOnSinglePage: true
          }}
          rowKey="tuid"
          dataSource={itemsQuery.users}
          className="table"
          rowClassName={(bond, idx) => idx % 2 === 0 ? 'table-even' : 'table-odd'}
        >
          <Column
            title="Name"
            dataIndex="name"
            render={(name, { tuid }) => (
              <Link className={styles.link} to={`/issuers/${tuid}`}>{name}</Link>
            )}
          />
          <Column
            align="right"
            title="Link"
            dataIndex="auxData.link"
            render={(link, { email }) => (
              link ? <Link className={styles.link} to={link}>{link}</Link> : (<div>{email}</div>)
            )}
          />
        </Table>
      </Card>
    )
  }
}

export default Issuers
