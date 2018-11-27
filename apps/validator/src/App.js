import React, { Component } from 'react'

import { Provider, observer, inject } from 'mobx-react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import { withRouter } from 'react-router'
import { ApolloProvider } from 'react-apollo'
import { LocaleProvider, Layout, Alert } from 'antd'
import en_US from 'antd/lib/locale-provider/en_US'

import Sidebar from 'src/_components/Sidebar'
import HeaderBack from 'src/_components/HeaderBack'

import rootStore from 'src/stores/root'
import Reports from 'src/containers/Reports'
import ReportItem from 'src/containers/ReportItem'
import Page404 from 'src/containers/Page404'

import Login from 'src/containers/Login'
import LoginFooter from 'src/containers/Login/Footer'

import Profile from 'src/containers/Profile'
import ProfileEdit from 'src/containers/ProfileEdit'

import './App.css'
import classStyles from './App.module.css'

const { Content, Footer, Sider } = Layout

const ProfileLayout = () => (
  <Layout>
    <Sider>
      <Sidebar />
    </Sider>
    <Content>
      <Profile />
    </Content>
  </Layout>
)

const ReportsLayout = () => (
  <Layout>
    <Sider>
      <Sidebar />
    </Sider>
    <Layout>
      <Content>
        <Reports />
      </Content>
    </Layout>
  </Layout>
)

const ReportItemLayout = () => (
  <Layout>
    <Sider>
      <Sidebar />
    </Sider>
    <Layout>
      <HeaderBack to="/reports" title="Report" />
      <Content>
        <ReportItem />
      </Content>
    </Layout>
  </Layout>
)

@inject('authStore')
@withRouter
@observer
class ToLocaleProvider extends Component {
  render() {
    const { user } = this.props.authStore

    if (!user) {
      return (
        <Switch>
          <Route
            path={'/login'}
            render={props => (
              <Layout className={classStyles.layout}>
                <Alert message="If you would like to register as an Issuer or Validator, please send an email to register@greenassetswallet.org to start the process." banner closable />
                <Content className={classStyles.content}>
                  <Login {...props} />
                </Content>
                <Footer>
                  <LoginFooter />
                </Footer>
              </Layout>
            )}
          />
          <Redirect to="/login" />
        </Switch>
      )
    }
    return (
      <Switch>
        <Route>
          <Switch>
            <Route path="/reports/:tuid" component={ReportItemLayout} />
            <Route path="/reports" component={ReportsLayout} />
            <Route
              path={'/profile/edit'}
              render={props => (
                <Layout className={classStyles.layout}>
                  <HeaderBack to="/profile" title="Profile Edit" />
                  <Content className={classStyles.content}>
                    <ProfileEdit {...props} />
                  </Content>
                </Layout>
              )}
            />
            <Route path="/profile" component={ProfileLayout} />

            <Route exact path="/login" render={() => <Redirect to="/" />} />
            <Route exact path="/" render={() => <Redirect to="/reports" />}/>
            <Route component={Page404} />
          </Switch>
        </Route>
      </Switch>
    )
  }
}

const App = () => {
  return (
    <Provider {...rootStore}>
      <Router>
        <ApolloProvider client={rootStore.apolloClient}>
          <LocaleProvider locale={en_US}>
            <ToLocaleProvider />
          </LocaleProvider>
        </ApolloProvider>
      </Router>
    </Provider>
  )
}

export default App
