import React from 'react'
import { Table } from 'antd'

const { Column } = Table

export default function Account() {
  return (
    <Table>
      <Column title="Keys" key="keys"/>
    </Table>
  )
}
