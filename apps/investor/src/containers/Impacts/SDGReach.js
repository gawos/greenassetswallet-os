import React, { PureComponent } from 'react'
import { Card, Row, Col } from 'antd'

import { goals as allGoals } from 'src/constants'

import styles from './Impact.module.css'

class SDGReach extends PureComponent {
  render() {
    const { goals = [] } = this.props

    return (
      <Card bordered={false} className={styles.card}>
        <div className={styles.cardTitle}>SDG Reach</div>
        <Row type="flex" justify="space-between" gutter={24}>
          {goals.map((goal, idx) => <Col span={6} key={idx} className={styles.goal}>
            <img className={styles.goalImg} alt="logo" src={allGoals[goal.tuid].logo} width="60" height="60" />
            <div className={styles.goalText}>{goal.text}</div>
          </Col>)}
        </Row>
      </Card>
    )
  }
}

export default SDGReach
