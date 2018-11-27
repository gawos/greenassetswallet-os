import React, { PureComponent, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { Card, Spin, Select, Button, Modal } from 'antd'
import { withRouter } from 'react-router'

import LinkBtn from 'src/_components/LinkBtn'
import Bonds from 'src/containers/Bonds'
import Projects from 'src/containers/Projects'

import { portfolio as portfolioQueryTmpl } from 'src/queries/queries.gql'
import { portfolioRemoveBond as portfolioRemoveBondTmpl } from 'src/queries/mutations.gql'

import appClassStyles from 'src/App/App.module.css'
import styles from './PortfolioItem.module.css'

const { Option } = Select

@withRouter
@compose(
  graphql(portfolioQueryTmpl, {
    options: ({ match }) => ({ variables: { tuid: match.params.tuid } }),
    name: 'itemQuery'
  }),
  graphql(portfolioRemoveBondTmpl, { name: 'portfolioRemoveBond' })
)
class PortfolioItem extends PureComponent {
  handleChange = tuid => {
    const { history } = this.props
    history.push(`/portfolios/${tuid}`)
  }

  removeBond = bondTuid => {
    const { match, portfolioRemoveBond } = this.props
    Modal.confirm({
      title: 'Remove Bond',
      content: <div>Are you sure you want to remove this Bond from portfolio?</div>,
      cancelText: 'Back',
      okText: 'Yes',
      onOk: async () => {
        await portfolioRemoveBond({
          variables: {
            tuid: match.params.tuid,
            bondTuid
          },
          refetchQueries: ['portfolio']
        })
      }
    })
  }


  render() {
    const { itemQuery, match } = this.props

    if (itemQuery.error)
      return (
        <Fragment>
          Error!
          <div>{itemQuery.error ? itemQuery.error.message : null}</div>
        </Fragment>
      )

    if (itemQuery.loading)
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 48px)'
          }}
        >
          <Spin size="large" />
        </div>
      )

    const { portfolio } = itemQuery

    if (!portfolio)
      return (
        <Fragment>
          <Card bordered={false}>
            <div className={styles.titleContainer}>
              <div className={styles.title}>Portfolio</div>
              <div className={styles.titleActions}>
                <LinkBtn
                  primary
                  ghost
                  icon="plus"
                  link={'/portfolios/new'}
                  text="New Portfolio"
                />
              </div>
            </div>
          </Card>
          <div className={appClassStyles.content}>
            <Card>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                  fontSize: '20px'
                }}
              >
                Portfolio does not exists or was removed
              </div>
            </Card>
          </div>
        </Fragment>
      )

    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.titleContainer}>
            <div className={styles.title}>{portfolio.name}</div>
            <div className={styles.titleActions}>
              {!!portfolio.portfolios && (
                <div>
                  <div className={styles.titleSelect}>Change portfolio</div>
                  <Select
                    value={match.params.tuid}
                    className={styles.select}
                    placeholder="Select portfolio"
                    onChange={this.handleChange}
                  >
                    {portfolio.portfolios.map(p => (
                      <Option key={p.tuid} value={p.tuid}>
                        {p.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              )}
              <LinkBtn
                primary
                ghost
                icon="plus"
                link={'/portfolios/new'}
                text="New Portfolio"
                className={styles.newPortfolio}
              />
            </div>
          </div>
        </Card>
        <div className={appClassStyles.content}>
          <Bonds
            className={styles.card}
            bonds={portfolio.bonds.map(b => ({
              ...b.bond,
              ownedAmount: b.amount
            }))}
            portfolioId={match.params.tuid}
            withOwnedAmount={true}
            sorted={true}
            renderActions={({ tuid }) => <Button onClick={() => this.removeBond(tuid)} shape="circle" icon="minus" />}
          />
          <Projects
            className={styles.card}
            projects={portfolio.projects.map(p => ({
              ...p.project,
              amount: p.amount
            }))}
            withAmount={true}
            sorted={true}
          />
        </div>
      </Fragment>
    )
  }
}

export default PortfolioItem
