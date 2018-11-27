import React, { PureComponent, Fragment } from 'react'
import { Table, Card } from 'antd'
import moment from 'moment'
import { Link } from 'react-router-dom'
import LinkBtn from 'src/_components/LinkBtn'
import BondItem from 'src/containers/BondItem'

import styles from './Bonds.module.css'

const { Column } = Table

class Bonds extends PureComponent {
  renderExpendedView = ({ tuid }) => <BondItem tuid={tuid} />

  renderTitle = (value, record) => (
    <LinkBtn primary ghost to={`/bonds/${record.tuid}`} text="Open" />
  )

  render() {
    const {
      title,
      isExpandable,
      bondsQuery,
      renderActions,
      className
    } = this.props

    if (bondsQuery.error)
      return (
        <Fragment>
          Error!
          <div>{bondsQuery.error ? bondsQuery.error.message : null}</div>
        </Fragment>
      )

    return (
      <Card className={className}>
        <Table
          title={title}
          className="table"
          rowKey={(b, id) => id}
          loading={bondsQuery.loading}
          dataSource={bondsQuery.bonds}
          pagination={{
            hideOnSinglePage: true
          }}
          expandedRowRender={isExpandable ? this.renderExpendedView : null}
          rowClassName={(bond, idx) => idx % 2 === 0 ? 'table-even' : 'table-odd'}
        >
          <Column
            title="ISIN"
            dataIndex="isin"
            render={(isin, { tuid }) => (
              <Link className={styles.link} to={`/bonds/${tuid}`}>
                {isin}
              </Link>
            )}
          />
          <Column
            title="ISSUING DATE"
            dataIndex="dateIssue"
            render={value => moment(value).format('DD-MM-YYYY')}
          />
          <Column
            title="DATE OF MATURITY"
            dataIndex="dateMaturity"
            render={value => moment(value).format('DD-MM-YYYY')}
          />
          <Column
            title="ISSUE VOLUME"
            dataIndex="volume"
            align={renderActions ? null : 'right'}
            render={(value, record) =>
              `${value} ${record.currency.toUpperCase()}`
            }
          />
          {renderActions ? (
            <Column key="actions" align="right" render={renderActions} />
          ) : null}
        </Table>
      </Card>

    )
  }
}

export default Bonds
