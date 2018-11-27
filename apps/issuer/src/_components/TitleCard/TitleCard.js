import React, { PureComponent,  } from 'react'
import { Card } from 'antd'

import styles from './TitleCard.module.css'

class TitleCard extends PureComponent {
  render() {
    const { title, actions } = this.props
    return (
      <Card bordered={false}>
        <div className={`${styles.titleContainer} header-wrapper`}>
          <div className={styles.title}>{title}</div>
          <div className={styles.actions}>{actions}</div>
        </div>
      </Card>
    )
  }
}

export default TitleCard
