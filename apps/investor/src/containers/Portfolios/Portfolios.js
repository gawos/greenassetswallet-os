import React, { PureComponent, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { Select } from 'antd'

import { portfolios as portfoliosQueryTmpl } from 'src/queries/queries.gql'

import LinkBtn from 'src/_components/LinkBtn'
import TitleCard from 'src/_components/TitleCard'
import PortfoliosTable from './PortfoliosTable'

import styles from './Portfolios.module.css'

const { Option } = Select

@compose(graphql(portfoliosQueryTmpl, { name: 'portfoliosQuery' }))
class Portfolios extends PureComponent {
  get renderPortfoliosTitle() {
    return (
      <div className={styles.sectionTitleContainer}>
        <div className={styles.sectionTitle}>My Portfolios</div>
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
    )
  }

  handleChange = tuid => {
    const { history } = this.props
    history.push(`/portfolios/${tuid}`)
  }

  get getHeaderActions() {
    const { match, portfoliosQuery } = this.props
    if (!portfoliosQuery.portfolios || !portfoliosQuery.portfolios.length) {
      return null
    }
    return (
      <div>
        <div className={styles.titleSelect}>Change portfolio</div>
        <Select
          value={match.params.tuid}
          className={styles.select}
          placeholder="Select portfolio"
          onChange={this.handleChange}
        >
          {portfoliosQuery.portfolios.map(p => (
            <Option key={p.tuid} value={p.tuid}>
              {p.name}
            </Option>
          ))}
        </Select>
      </div>
    )
  }

  render() {
    const { portfoliosQuery } = this.props
    if (portfoliosQuery.error)
      return (
        <Fragment>
          Error!
          <div>{portfoliosQuery.error ? portfoliosQuery.error.message : null}</div>
        </Fragment>
      )
    console.log('portfoliosQuery: ', portfoliosQuery)

    return (
      <Fragment>
        <TitleCard title="Portfolios" actions={this.getHeaderActions} />
        <div className="content-wrapper">
          <PortfoliosTable
            title={this.renderPortfoliosTitle}
            className={styles.card}
            portfolios={portfoliosQuery.portfolios}
            loading={portfoliosQuery.loading}
          />
        </div>
      </Fragment>
    )
  }
}

export default Portfolios
