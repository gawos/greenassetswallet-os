import React, { PureComponent, Fragment } from 'react'
import { Card, Table } from 'antd'
import { Link } from 'react-router-dom'

import styles from './Portfolios.module.css'

const { Column } = Table

class PortfoliosTable extends PureComponent {
  render() {
    const { title, className, portfolios, loading } = this.props
    return (
      <Fragment>
        {title || null}
        <Card className={className}>
          <Table
            className="table"
            rowKey={(b, idx) => idx}
            loading={loading}
            dataSource={portfolios}
            pagination={{ hideOnSinglePage: true }}
            rowClassName={(bond, idx) => idx % 2 === 0 ? 'table-even' : 'table-odd'}
          >
            <Column
              title="NAME"
              dataIndex="name"
              render={(name, { tuid }) => (
                <Link className={styles.link} to={`/portfolios/${tuid}`}>
                  {name}
                </Link>
              )}
            />
            <Column
              title="BONDS"
              dataIndex="bonds"
              render={bonds => bonds.length}
              align="right"
            />
          </Table>
        </Card>
      </Fragment>
    )
  }
}

export default PortfoliosTable
