import React, { PureComponent } from 'react'
import { Layout } from 'antd'

import Header from 'src/_components/Header'
import appStyles from 'src/App/App.module.css'
import PortfolioItem from './PortfolioItem'

const { Content } = Layout

export default class PortfolioItemLayout extends PureComponent {
  render() {
    return (
      <Layout className={appStyles.layout}>
        <Header />
        <Content>
          <PortfolioItem {...this.props} />
        </Content>
      </Layout>
    )
  }
}
