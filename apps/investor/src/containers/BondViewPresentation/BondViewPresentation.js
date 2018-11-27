import React, { Component, Fragment } from 'react'
import { Button, Table, Tooltip, Card } from 'antd'
import moment from 'moment'

//app modules

const { Column } = Table

const BondViewPresentation = ({ data, style }) => (
  <Card
    style={{
      display: 'relative',
      zIndex: 100,
      borderRadius: '5px'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <div>{data.isin}</div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ fontSize: '24px' }}>
        {data.volume} {data.currency}
      </div>
      <div>
        <div>Date of issue {moment(data.dateIssue).format('DD-MM-YYYY')}</div>
        <div>
          Date of maturity {moment(data.dateMaturity).format('DD-MM-YYYY')}
        </div>
      </div>
    </div>
  </Card>
)

export default BondViewPresentation
