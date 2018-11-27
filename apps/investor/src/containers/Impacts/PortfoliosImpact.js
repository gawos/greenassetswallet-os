import React, { PureComponent } from 'react'
import { Card, Row, Col } from 'antd'

import ImpactEnergyGeneration from './ImpactEnergyGeneration'
import ImpactEmissionAvoidances from './ImpactEmissionAvoidances'
import ImpactEnergyConsumptions from './ImpactEnergyConsumptions'
import SDGReach from './SDGReach'

const tempImpactData = {
  energyGenerations: [
    {
      amount: 350,
      measuring: 'kWh',
      portfolio: {
        tuid: 'temp123tu123id',
        name: 'Portfolio Name 1'
      }
    },
    {
      amount: 250,
      measuring: 'kWh',
      portfolio: {
        tuid: 'temp123tu123id',
        name: 'Portfolio Name 2'
      }
    },
    {
      amount: 150,
      measuring: 'kWh',
      portfolio: {
        tuid: 'temp123tu123id',
        name: 'Portfolio Name 3'
      }
    }
  ],
  emissionAvoidances: [
    {
      amount: 250,
      measuring: 'Mt CO2e',
      portfolio: {
        tuid: 'temp123tu123id',
        name: 'Portfolio Name 1'
      }
    },
    {
      amount: 350,
      measuring: 'Mt CO2e',
      portfolio: {
        tuid: 'temp123tu123id',
        name: 'Portfolio Name 2'
      }
    },
    {
      amount: 150,
      measuring: 'Mt CO2e',
      portfolio: {
        tuid: 'temp123tu123id',
        name: 'Portfolio Name 3'
      }
    }
  ],
  energyConsumptions: [
    {
      name: 'electricity',
      amount: 350,
      measuring: 'kWh'
    },
    {
      name: 'cooling',
      amount: 250,
      measuring: 'kWh'
    },
    {
      name: 'heating',
      amount: 150,
      measuring: 'kWh'
    }
  ],
  goals: [
    {
      tuid: 0,
      text: 'SDG 1: No Poverty'
    },
    {
      tuid: 1,
      text: 'SDG 2: Zero Hunger'
    },
    {
      tuid: 10,
      text: 'SDG 10: Reducing Inequalities'
    },
    {
      tuid: 14,
      text: 'SDG 15: Life on Land'
    },
  ]
}

class PortfoliosImpact extends PureComponent {
  render() {
    const { className } = this.props

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



        <Row type="flex" justify="space-between" gutter={24}>
          <Col span={12}>
            <ImpactEnergyGeneration energyGenerations={tempImpactData.energyGenerations} />
            <ImpactEmissionAvoidances emissionAvoidances={tempImpactData.emissionAvoidances} />
          </Col>
          <Col span={12}>
            <ImpactEnergyConsumptions energyConsumptions={tempImpactData.energyConsumptions} />
          </Col>
          <Col span={24}>
            <SDGReach goals={tempImpactData.goals} />
          </Col>
        </Row>
      </Card>
    )
  }
}

export default PortfoliosImpact
