import React, { PureComponent } from 'react'
import { Card, Table } from 'antd'
import { Link } from 'react-router-dom'

import ValidatorItemView from 'src/containers/ValidatorItem/ValidatorItemView'

import styles from './Validators.module.css'

const { Column } = Table

class ValidatorsTable extends PureComponent {
  renderExpendedView = validator => <ValidatorItemView validator={validator} />

  render() {
    const { validators, loading, isExpandable } = this.props
    return (
      <Card>
        <Table
          className="table"
          rowKey={(b, idx) => idx}
          loading={loading}
          dataSource={validators}
          pagination={{
            hideOnSinglePage: true
          }}
          expandedRowRender={isExpandable ? this.renderExpendedView : null}
          rowClassName={(bond, idx) => idx % 2 === 0 ? 'table-even' : 'table-odd'}
        >
          <Column
            title="Name"
            dataIndex="name"
            render={(name, { tuid }) => (
              <Link className={styles.link} to={`/validators/${tuid}`}>{name}</Link>
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

export default ValidatorsTable
