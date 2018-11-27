import React, { PureComponent, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Form, Table, Card } from 'antd'
import { graphql, compose } from 'react-apollo'

import HeaderCard from 'src/_components/HeaderCard'

import { users as usersQuery } from 'src/queries/queries.gql'
import styles from './Users.module.css'

const { Column } = Table

@compose(graphql(usersQuery, { name: 'usersQuery' }))
@Form.create()
class Users extends PureComponent {
  get getHeaderAction() {
    return (
      <Link className="ant-btn ant-btn-primary ant-btn-background-ghost" to="/users/new" >NEW</Link>
    )
  }

  render() {
    const { usersQuery, className } = this.props

    if (usersQuery.error)
      return (
        <Fragment>
          Error!
          <div>{usersQuery.error ? usersQuery.error.message : null}</div>
        </Fragment>
      )

    return (
      <Fragment>
        <HeaderCard title="Users List" actions={this.getHeaderAction} />
        <div className="content-wrapper">
          <Card className={className} >
            <Table
              pagination={{
                hideOnSinglePage: true
              }}
              rowKey={(b, idx) => idx}
              loading={usersQuery.loading}
              dataSource={usersQuery.users}
              rowClassName={(project, idx) => idx % 2 === 0 ? 'table-even' : 'table-odd'}
            >
              <Column
                title="Name"
                dataIndex="name"
                render={(name, { tuid }) => (
                  <Link className={styles.link} to={`/users/${tuid}`}>
                    {name}
                  </Link>
                )}
              />
              <Column title="Email" dataIndex="email" />
              <Column title="Role" dataIndex="role" align="right" />
            </Table>
          </Card>
        </div>
      </Fragment>
    )
  }
}

export default Users
