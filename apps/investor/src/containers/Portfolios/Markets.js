import React, { PureComponent, Fragment } from 'react'

import PortfoliosMarkets from 'src/containers/Impacts/PortfoliosMarkets'

import styles from './Portfolios.module.css'

const tempMarkets = [
  { region: 'europe', count: 30 },
  { region: 'asia', count: 20 },
  { region: 'africa', count: 3 },
  { region: 'north_america', count: 60 },
  { region: 'south_america', count: 20 },
  { region: 'oceania', count: 10 }
]

class Markets extends PureComponent {
  render() {
    const { className } = this.props

    return (
      <Fragment>
        <div className={styles.cardTitle}>Markets</div>
        <PortfoliosMarkets className={className} markets={tempMarkets} />
      </Fragment>
    )
  }
}

export default Markets
