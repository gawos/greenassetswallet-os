import React, { PureComponent } from 'react'
import { Card, Row, Col } from 'antd'
import { PieChart, Pie, Legend, Cell } from 'recharts'

import { COLORS, regions } from 'src/constants'

import styles from './Impact.module.css'

class PortfoliosMarkets extends PureComponent {
  render() {
    const { markets = [], className } = this.props

    return (
      <Card className={className}>


      

        {/* Remove after server data will be done */}
        <div
          style={{
            position: 'absolute',
            zIndex: 100,
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div style={{backgroundColor: '#ccc', width: '100%', height: '100%', position: 'absolute', opacity: .1, }} />
          <div style={{ fontSize: '20px' }}>Coming Soon!!!</div>
        </div>




        {<PieChart width={830} height={120}>
          <Pie cx={40} data={markets} dataKey="count">
            {markets.map((d, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            width={700}
            layout="vertical"
            verticalAlign="middle"
            align="right"
            content={({ payload }) => <Row type="flex" justify="space-between" gutter={24} className={styles.marketsLegend}>
              {payload.map((p, idx) => (
                <Col span={8} key={idx} >
                  <div key={idx} className={styles.legendItem}>
                    <div
                      className={styles.legendIconLine}
                      style={{ backgroundColor: p.color }}
                    />
                    <div className={styles.legendContainer}>
                      <div className={styles.legendTitle}>{regions[p.payload.region]}</div>
                      <div className={styles.legendValue}>
                        <b>{Math.round(p.payload.percent * 10000) / 100} %</b>
                        {' '} {p.payload.amount} {p.payload.measuring}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>}
          />
        </PieChart>}
      </Card>
    )
  }
}

export default PortfoliosMarkets
