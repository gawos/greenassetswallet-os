import React, { PureComponent, Fragment } from 'react'

import PortfoliosImpact from 'src/containers/Impacts/PortfoliosImpact'

import styles from './MyImpact.module.css'

export default class MyImpact extends PureComponent {
  render() {
    const { className } = this.props

    return (
      <Fragment>
        <div className={styles.title}>My Impact</div>
        <PortfoliosImpact className={className} />
      </Fragment>
    )
  }
}
