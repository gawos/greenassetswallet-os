import React, { PureComponent } from 'react'
import { Layout } from 'antd'

import SignUp from './SignUp'
import LoginFooter from 'src/containers/Login/Footer'

import appStyles from 'src/App/App.module.css'

const { Content, Footer } = Layout

export default class SignUpLayout extends PureComponent {
  render() {
    return (
      <Layout className={appStyles.layout}>
        <Content className={appStyles.content}>
          <SignUp {...this.props} />
        </Content>
        <Footer>
          <LoginFooter />
        </Footer>
      </Layout>
    )
  }
}
