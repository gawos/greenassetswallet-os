import React, { PureComponent } from 'react'
import { Layout } from 'antd'

import Header from 'src/_components/Header'
import Validators from './Validators'

import classStyles from '../../App/App.module.css'

const { Content } = Layout

export default class ValidatorsLayout extends PureComponent {
  render() {
    return (
      <Layout className={classStyles.layout}>
        <Header />
        <Content
          className={classStyles.content}
          style={{ maxWidth: '1000px', margin: '0 auto' }}
        >
          <Validators {...this.props} />
        </Content>
      </Layout>
    )
  }
}
