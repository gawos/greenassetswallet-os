import React, { PureComponent } from 'react'
import { Layout, Alert } from 'antd'

import Login from './Login'
import LoginFooter from './Footer'

import appStyles from 'src/App/App.module.css'

const { Content, Footer } = Layout

export default class LoginLayout extends PureComponent {
  render() {
    return (
      <Layout className={appStyles.layout}>
        <Alert message="If you would like to register as an Issuer or Validator, please send an email to register@greenassetswallet.org to start the process." banner closable />
        <Content className={appStyles.content}>
          <Login {...this.props} />
        </Content>
        <Footer>
          <LoginFooter />
        </Footer>
      </Layout>
    )
  }
}
