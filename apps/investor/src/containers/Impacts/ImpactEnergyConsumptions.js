import React, { PureComponent } from 'react'
import { Card } from 'antd'
import { PieChart, Pie, Legend, Cell } from 'recharts'

import { COLORS } from 'src/constants'

import styles from './Impact.module.css'

class ImpactEnergyConsumptions extends PureComponent {
  render() {
    const { energyConsumptions = [] } = this.props

    return (
      <Card bordered={false} className={styles.card}>
        <div className={styles.cardTitle}>Renewable Energy Consumptions</div>
        <div className={styles.cardValue}>
          <span>{energyConsumptions.reduce((acc, gen) => acc += gen.amount, 0)} {energyConsumptions[0] ? energyConsumptions[0].measuring : null}</span>
        </div>
        <div className={styles.cardValue}>
          <PieChart width={370} height={165}>
            <Pie cx={60} data={energyConsumptions} dataKey="amount">
              {energyConsumptions.map((d, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              content={({ payload }) => payload.map((p, idx) => (
                <div key={idx} className={styles.legendItem}>
                  <div
                    className={styles.legendIconLine}
                    style={{ backgroundColor: p.color }}
                  />
                  <div className={styles.legendContainer}>
                    <div className={styles.legendTitle}>{p.value}</div>
                    <div className={styles.legendValue}>
                      <b>{Math.round(p.payload.percent * 10000) / 100} %</b>
                      {' '} {p.payload.amount} {p.payload.measuring}
                    </div>
                  </div>
                </div>
              ))}
            />
          </PieChart>
        </div>
      </Card>
    )
  }
}

export default ImpactEnergyConsumptions
