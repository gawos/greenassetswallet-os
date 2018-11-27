import React, { Component } from 'react'

import { Provider, observer, inject } from 'mobx-react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { ApolloProvider } from 'react-apollo'
import { LocaleProvider, Layout } from 'antd'
import en_US from 'antd/lib/locale-provider/en_US'
import { compose, graphql } from 'react-apollo'

/* app modules */
import rootStore from 'src/stores/root'

import { projects as projectsQueryTmpl } from 'src/queries/queries.gql'

import Header from 'src/_components/Header'
import HeaderBack from 'src/_components/HeaderBack'
import TitleCard from 'src/_components/TitleCard'

import SignUpForgetPassword from 'src/containers/SignUp/SignUpForgetPassword'
import SignUpActivation from 'src/containers/SignUp/Activation'
import SignUpCheckEmail from 'src/containers/SignUp/CheckEmail'

import Login from 'src/containers/Login'
import LoginFooter from 'src/containers/Login/Footer'

import PortfolioCreate from 'src/containers/PortfolioCreate'
import PortfoliosLayout from 'src/containers/Portfolios'
import PortfolioItemLayout from 'src/containers/PortfolioItem'

import ProjectsTmpl from 'src/containers/Projects/_Projects'
import ProjectItemLayout from 'src/containers/ProjectItem'

import BondItem from 'src/containers/BondItem'

import Issuers from 'src/containers/Issuers'
import IssuerItem from 'src/containers/IssuerItem'

import ValidatorsLayout from 'src/containers/Validators'
import ValidatorsItemLayout from 'src/containers/ValidatorsItem'

import Page404 from 'src/containers/Page404'

import './App.css'
import classStyles from './App.module.css'
import BondsToPortfolio from '../containers/BondsToPortfolio'

const { Content, Footer } = Layout

const IssuerItemLayout = () => (
  <Layout>
    <HeaderBack to="/issuers" title="Issuer details" />
    <Content>
      <IssuerItem />
    </Content>
  </Layout>
)

const IssuerLayout = () => (
  <Layout>
    <Header />
    <Content>
      <TitleCard title="Issuers" />
      <div className="content-wrapper">
        <Issuers />
      </div>
    </Content>
  </Layout>
)

const Projects = compose(
  graphql(projectsQueryTmpl, {
    name: 'itemsQuery'
  })
)(ProjectsTmpl)

@inject('authStore')
@withRouter
@observer
class ToLocaleProvider extends Component {
  static propTypes = {
    authStore: PropTypes.object.isRequired
  }
  render() {
    const { user } = this.props.authStore

    if (!user) {
      return (
        <Switch>
          <Route
            path={'/auth/login'}
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
          <Route
            path={'/auth/sign-up'}
            render={props => (
              <Layout className={classStyles.layout}>
                <Content className={classStyles.content}>
                  <SignUpForgetPassword {...props} />
                </Content>
                <Footer>
                  <LoginFooter />
                </Footer>
              </Layout>
            )}
          />
          <Route
            path={'/auth/set-up/check-email'}
            render={props => (
              <Layout className={classStyles.layout}>
                <Content className={classStyles.content}>
                  <SignUpCheckEmail {...props} />
                </Content>
                <Footer>
                  <LoginFooter />
                </Footer>
              </Layout>
            )}
          />
          <Route
            path={'/auth/set-up/:token'}
            render={props => (
              <Layout className={classStyles.layout}>
                <Content className={classStyles.content}>
                  <SignUpActivation {...props} />
                </Content>
                <Footer>
                  <LoginFooter />
                </Footer>
              </Layout>
            )}
          />

          <Route
            path={'/auth/password-reset/:token'}
            render={props => (
              <Layout className={classStyles.layout}>
                <Content className={classStyles.content}>
                  <SignUpActivation {...props} />
                </Content>
                <Footer>
                  <LoginFooter />
                </Footer>
              </Layout>
            )}
          />

          <Redirect to="/auth/login" />
        </Switch>
      )
    }
    return (
      <Switch>
        <Route>
          <Switch>
            <Route path="/portfolios/new"
              render={props => (
                <Layout className={classStyles.layout}>
                  <Header />
                  <Content className={classStyles.content}>
                    <PortfolioCreate
                      style={{ paddingLeft: '35px', marginRight: '25px' }}
                      {...props}
                    />
                  </Content>
                </Layout>
              )}
            />
            <Route path="/portfolios/:tuid" component={PortfolioItemLayout} />
            <Route path="/portfolios" component={PortfoliosLayout} />
            <Route path="/issuers/:tuid" component={IssuerItemLayout} />
            <Route path="/issuers" component={IssuerLayout} />

            <Route path={'/validators/:tuid'} component={ValidatorsItemLayout} />
            <Route path={'/validators'} component={ValidatorsLayout} />

            <Route path={'/projects/:tuid'} component={ProjectItemLayout} />
            <Route
              path={'/projects'}
              render={props => (
                <Layout className={classStyles.layout}>
                  <Header />
                  <Content
                    className={classStyles.content}
                    style={{ maxWidth: '1000px', margin: '0 auto' }}
                  >
                    <Projects {...props} />
                  </Content>
                </Layout>
              )}
            />
            <Route
              path={'/bonds/:tuid'}
              render={props => (
                <Layout className={classStyles.layout}>
                  <HeaderBack to="/bonds" title="Bond details" />
                  <Content className={classStyles.content}>
                    <BondItem {...props} />
                  </Content>
                </Layout>
              )}
            />
            <Route
              path={'/bonds'}
              render={props => (
                <Layout className={classStyles.layout}>
                  <Header />
                  <Content
                    className={classStyles.content}
                    style={{ maxWidth: '1000px', margin: '0 auto' }}
                  >
                    <BondsToPortfolio {...props} />
                  </Content>
                </Layout>
              )}
            />

            <Route path="/auth" render={props => <Redirect to="/" />} />
            <Route exact path={'/'} render={props => <Redirect to="/portfolios" />} />

            <Route
              render={props => (
                <Layout className={classStyles.layout}>
                  <Header />
                  <Content>
                    <Page404 {...props} />
                  </Content>
                </Layout>
              )}
            />
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
}

export default App
