import React, { PureComponent } from 'react'
import { Card } from 'antd'
import { BarChart, Bar, Cell } from 'recharts'

import { COLORS } from 'src/constants'

import styles from './Impact.module.css'

class ImpactEmissionAvoidances extends PureComponent {
  render() {
    const { emissionAvoidances } = this.props

    return (
      <Card bordered={false} className={styles.card}>
        <div className={styles.cardTitle}>Renewable Energy Generation</div>
        <div className={styles.cardValue}>
          <span>{emissionAvoidances.reduce((acc, gen) => acc += gen.amount, 0)} {emissionAvoidances[0] ? emissionAvoidances[0].measuring : null}</span>
          <BarChart width={150} height={50} data={emissionAvoidances} className={styles.chartRight}>
            <Bar dataKey="amount" >
              {emissionAvoidances.map((entry, idx) => (
                <Cell fill={COLORS[idx % COLORS.length]} key={`cell-${idx}`}/>
              ))}
            </Bar>
          </BarChart>
        </div>
      </Card>
    )
  }
}

export default ImpactEmissionAvoidances
