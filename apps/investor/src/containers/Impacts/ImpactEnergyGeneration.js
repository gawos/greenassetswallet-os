import React, { PureComponent } from 'react'
import { Card } from 'antd'
import { BarChart, Bar, Cell } from 'recharts'

import { COLORS } from 'src/constants'

import styles from './Impact.module.css'

class ImpactEnergyGeneration extends PureComponent {
  render() {
    const { energyGenerations } = this.props

    return (
      <Card bordered={false} className={styles.card}>
        <div className={styles.cardTitle}>Renewable Energy Generation</div>
        <div className={styles.cardValue}>
          <span>{energyGenerations.reduce((acc, gen) => acc += gen.amount, 0)} {energyGenerations[0] ? energyGenerations[0].measuring : null}</span>
          <BarChart width={150} height={50} data={energyGenerations} className={styles.chartRight}>
            <Bar dataKey="amount" >
              {energyGenerations.map((entry, idx) => (
                <Cell fill={COLORS[idx % COLORS.length]} key={`cell-${idx}`}/>
              ))}
            </Bar>
          </BarChart>
        </div>
      </Card>
    )
  }
}

export default ImpactEnergyGeneration
