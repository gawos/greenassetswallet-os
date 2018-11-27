import React, { PureComponent } from 'react'
import { Layout } from 'antd'

import Header from 'src/_components/Header'
import classStyles from 'src/App/App.module.css'
import Portfolios from './Portfolios'

const { Content } = Layout

export default class PortfoliosLayout extends PureComponent {
  render() {
    return (
      <Layout className={classStyles.layout}>
        <Header />
        <Content>
          <Portfolios {...this.props} />
        </Content>
      </Layout>
    )
  }
}
