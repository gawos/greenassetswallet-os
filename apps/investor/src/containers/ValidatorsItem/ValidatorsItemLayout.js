import React, { PureComponent } from 'react'
import { Layout } from 'antd'

import HeaderBack from 'src/_components/HeaderBack'
import ValidatorsItem from './ValidatorsItem'

import classStyles from '../../App/App.module.css'

const { Content } = Layout

export default class ValidatorsItemLayout extends PureComponent {
  render() {
    return (
      <Layout className={classStyles.layout}>
        <div className={classStyles.index}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <HeaderBack to="/validators" title="Validator details" />
          </div>
        </div>
        <Content
          className={classStyles.content}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <ValidatorsItem {...this.props} />
        </Content>
      </Layout>
    )
  }
}
