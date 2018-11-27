import React, { PureComponent, Fragment } from 'react'
import { Table, Card } from 'antd'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { compose, graphql } from 'react-apollo'

import BondItem from 'src/containers/BondItem'

import { bonds as bondsQueryTmpl } from 'src/queries/queries.gql'

import styles from './Bonds.module.css'

const { Column } = Table

@compose(
  graphql(bondsQueryTmpl, {
    options: ({ issuer }) => ({
      variables: {
        filter: {
          issuer
        }
      }
    }),
    name: 'bondsQuery'
  })
)
class BondsView extends PureComponent {
  renderExpendedView = ({ tuid }) => <BondItem tuid={tuid} />

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
      <Fragment>
        {title || null}
        <Card className={className}>
          <Table
            className="table"
            rowKey={(b, idx) => idx}
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
              title="ISSUER"
              dataIndex="issuer"
              render={issuer => (
                <Link className={styles.link} to={`/issuers/${issuer.tuid}`}>
                  {issuer.name}
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
      </Fragment>
    )
  }
}

export default BondsView
