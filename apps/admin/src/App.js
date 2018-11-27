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
import { LocaleProvider, Layout } from 'antd'
import en_US from 'antd/lib/locale-provider/en_US'

import rootStore from 'src/stores/root'

import Sidebar from 'src/_components/Sidebar'
import HeaderBack from 'src/_components/HeaderBack'
import Users from 'src/containers/Users'
import UserCreate from 'src/containers/UserCreate'
import UserView from 'src/containers/UserView'
import Page404 from 'src/containers/Page404'

import Login from 'src/containers/Login'
import LoginFooter from 'src/containers/Login/Footer'

import classStyles from './App.module.css'
import './App.css'

const { Content, Footer, Sider } = Layout

const UsersLayout = () => (
  <Layout>
    <Sider>
      <Sidebar />
    </Sider>
    <Content>
      <Users />
    </Content>
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
            <Route
              path={'/users/new'}
              render={props => (
                <Layout>
                  <Sider>
                    <Sidebar />
                  </Sider>
                  <Layout className={classStyles.layout}>
                    <HeaderBack to="/users" title="Create User" />
                    <Content className={classStyles.content}>
                      <UserCreate {...props} />
                    </Content>
                  </Layout>
                </Layout>
              )}
            />
            <Route
              path={'/users/:tuid'}
              render={props => (
                <Layout className={classStyles.layout}>
                  <HeaderBack to="/users" title="User" />
                  <Content className={classStyles.content}>
                    <UserView {...props} />
                  </Content>
                </Layout>
              )}
            />

            <Route path="/users" component={UsersLayout} />

            <Route exact path="/login" render={props => <Redirect to="/" />} />
            <Route exact path="/" render={props => <Redirect to="/users" />} />

            <Route component={Page404} />
          </Switch>
        </Route>
      </Switch>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Provider {...rootStore}>
        <Router basename={process.env.BASE_URL}>
          <ApolloProvider client={rootStore.apolloClient}>
            <LocaleProvider locale={en_US}>
              <ToLocaleProvider />
            </LocaleProvider>
          </ApolloProvider>
        </Router>
      </Provider>
    )
  }
}

export default App
