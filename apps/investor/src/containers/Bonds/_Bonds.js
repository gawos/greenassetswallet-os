import React, { Component, Fragment } from 'react'

import { Link } from 'react-router-dom'

import { Table } from 'antd'
import moment from 'moment'

//app modules
import BondItem from 'src/containers/BondItem'
const { Column } = Table

class Bonds extends Component {
  renderExpendedView = ({ tuid }) => <BondItem tuid={tuid} />

  renderTitle = (value, { isin, issuer }) => (
    <Fragment>
      <div>
        {issuer ? (
          <Link
            to={`/issuers/${issuer.tuid}`}
            style={{ color: 'rgb(18, 56, 152)', fontSize: '18px' }}
          >
            {issuer.name}
          </Link>
        ) : (
          <div style={{ color: 'red', fontSize: '18px' }}>UNKNOWN ISSUER</div>
        )}
      </div>
      <div style={{ color: 'rgb(18, 56, 152)', fontSize: '24px' }}>
        {/*   <Link to="/"> */}
        {isin}
        {/* </Link> */}
      </div>
    </Fragment>
  )

  renderActions = (value, record) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link
          className="ant-btn ant-btn-primary ant-btn-background-ghost"
          to={`/bonds/${record.tuid}`}
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
    const { bonds } = itemsQuery

    return (
      <Table
        className="tableNoBorder"
        title={this.props.title}
        loading={itemsQuery.loading}
        rowKey="tuid"
        dataSource={bonds}
        pagination={{
          hideOnSinglePage: true
        }}
        expandedRowRender={
          this.props.isExpandable ? this.renderExpendedView : null
        }
      >
        <Column title="ISSUER/ISIN" key={'isin'} render={this.renderTitle} />

        <Column
          key="dateIssue"
          title={'ISSUE/MATURITY DATE'}
          render={(value, record) => (
            <div style={{ fontSize: '13px' }}>
              <div>
                <span> {moment(record.dateIssue).format('DD-MM-YYYY')}</span>
              </div>
              <div style={{ height: '5px' }} />
              <div>
                <span>{moment(record.dateMaturity).format('DD-MM-YYYY')}</span>
              </div>
            </div>
          )}
        />
        <Column
          title="VOLUME"
          key={'volume'}
          dataIndex="volume"
          render={(value, record) =>
            `${value} ${record.currency.toUpperCase()}`
          }
        />

        {this.props.withOwnedAmount && (
          <Column
            title="AMOUNT HELD"
            key={'ownedAmount'}
            render={(value, record) =>
              record.ownedAmount === undefined
                ? 'not owned'
                : `${record.ownedAmount} ${record.currency.toUpperCase()}`
            }
          />
        )}

        <Column
          key="actions"
          render={this.props.renderActions || this.renderActions}
        />
      </Table>
    )
  }
}

export default Bonds
