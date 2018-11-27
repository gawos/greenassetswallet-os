import React, { Component, Fragment } from 'react'
import { observer, inject } from 'mobx-react'
import { Route, Switch, Redirect, Link } from 'react-router-dom'
import { Layout } from 'antd'
import { withRouter } from 'react-router'

import Sidebar from 'src/_components/Sidebar'
import HeaderBack from 'src/_components/HeaderBack'
import TitleCard from 'src/_components/TitleCard'

import Page404 from 'src/containers/Page404'

import FrameworkEdit from 'src/containers/FrameworkEdit'
import FrameworkCreate from 'src/containers/FrameworkCreate'

import Projects from 'src/containers/Projects'
import LinkBtn from 'src/_components/LinkBtn'
import ProjectItem from 'src/containers/ProjectItem'
import ProjectCreate from 'src/containers/ProjectCreate'
import ProjectEdit from 'src/containers/ProjectEdit'

import Bonds from 'src/containers/Bonds'
import BondItem from 'src/containers/BondItem'
import BondCreate from 'src/containers/BondCreate'
import BondEdit from 'src/containers/BondEdit'

import Pools from 'src/containers/Pools'
import PoolItem from 'src/containers/PoolItem'
import PoolCreate from 'src/containers/PoolCreate'
import PoolEdit from 'src/containers/PoolEdit'

import LoginLayout from 'src/containers/Login'
import SignUpLayout from 'src/containers/SignUp'

import Profile from 'src/containers/Profile'
import ProfileEdit from 'src/containers/ProfileEdit'
import Account from 'src/containers/Account'

import Validators from 'src/containers/Validators'
import ValidatorItem from 'src/containers/ValidatorItem'

import './App.css'
import classStyles from './App.module.css'

const { Content, Footer, Sider } = Layout

/* Move this to to APP folder as a separate files as screens */
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

const BondsLayout = () => (
  <Layout>
    <Sider>
      <Sidebar />
    </Sider>
    <Content>
      <Fragment>
        <TitleCard title="Bonds" actions={  <LinkBtn primary ghost icon="plus" to="/bonds/new" text="Create Bond" />} />
        <div className="content-wrapper">
          <Bonds renderActions={
            (value, record) => (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  href={`/bonds/${record.tuid}/edit`}
                  className="ant-btn ant-btn-primary ant-btn-background-ghost"
                  rel="noopener noreferrer"
                >
                    edit
                </a>
              </div>
            )}/>
        </div>
      </Fragment>
    </Content>
  </Layout>
)

const ProjectsLayout = () => (
  <Layout>
    <Sider>
      <Sidebar />
    </Sider>
    <Layout>
      <Content>
        <Fragment>
          <TitleCard title="Projects" actions={<LinkBtn primary ghost icon="plus" to="/projects/new" text="Create Project" />} />
          <div className="content-wrapper">
            <Projects isExpandable={true} />
          </div>
        </Fragment>
      </Content>
    </Layout>
  </Layout>
)

const ProjectEditLayout = () => (
  <Layout>
    <Sider>
      <Sidebar />
    </Sider>
    <Layout>
      <HeaderBack to="/projects" />
      <Content>
        <TitleCard title="Edit Project" />
        <div className="content-wrapper">
          <ProjectEdit />
        </div>
      </Content>
    </Layout>
  </Layout>
)

const PoolsLayout = () => (
  <Layout>
    <Sider>
      <Sidebar />
    </Sider>
    <Layout >
      <Content>
        <TitleCard title="Pools" actions={<LinkBtn primary ghost icon="plus" to="/pools/new" text="Create Project" />} />
        <div className="content-wrapper">
          <Pools/>
        </div>
      </Content>
    </Layout>
  </Layout>
)

const NotAuthenteticatedRouters = () => {
  return (
    <Switch>
      <Route path="/login" component={LoginLayout} />
      <Route path="/sign-up" component={SignUpLayout} />
      <Redirect to="/login" />
    </Switch>
  )
}

const PoolItemLayout = withRouter( props => (
  <Layout>
    <Layout className={classStyles.layout}>
      <Content>
        <HeaderBack to={'/pools'} title="Pool details"  actions={ ()=>
          <div style={{paddingRight: '20px'}}>
            <Link className={'ant-btn ant-btn-background-ghost'} to={`/pools/${props.match.params.tuid}/edit`}>
              Edit Pool
            </Link>
          </div>} />
        <PoolItem {...props} style={{ marginLeft: '5%' }} />
      </Content>
    </Layout>
  </Layout>
))

const ProjectItemLayout = () => (
  <Layout className={classStyles.layout}>
    <HeaderBack to={'/projects'} title="Project details" />
    <Content>
      <ProjectItem />
    </Content>
  </Layout>
)

const BondItemLayout = () => (
  <Layout className={classStyles.layout}>
    <HeaderBack to={'/projects'} title="Project details" />
    <Content>
      <BondItem />
    </Content>
  </Layout>
)

const ValidatorsLayout = () => (
  <Layout>
    <Sider>
      <Sidebar />
    </Sider>
    <Layout>
      <Content>
        <Validators />
      </Content>
    </Layout>
  </Layout>
)

const ValidatorItemLayout = () => (
  <Layout>
    <Sider>
      <Sidebar />
    </Sider>
    <Layout>
      <Content>
        <HeaderBack to={'/validators'} />
        <ValidatorItem />
      </Content>
    </Layout>
  </Layout>
)


const AuthenteticatedRouters = () => {
  return (
    <Switch>
      <Route>
        <Fragment>
          <Switch>
            <Route path="/validators/:tuid" component={ValidatorItemLayout} />
            <Route path="/validators" component={ValidatorsLayout} />

            <Route
              path={'/frameworks/new'}
              render={props => (
                <Layout>
                  <Sider>
                    <Sidebar />
                  </Sider>
                  <Layout className={classStyles.layout}>
                    <HeaderBack to="/profile" title="New Framework" />
                    <Content className={classStyles.content}>
                      <FrameworkCreate {...props} />
                    </Content>
                  </Layout>
                </Layout>
              )}
            />
            <Route
              path={'/frameworks/:tuid/edit'}
              render={props => (
                <Layout>
                  <Sider>
                    <Sidebar />
                  </Sider>
                  <Layout className={classStyles.layout}>
                    <HeaderBack to={'/profile'} title="Framework edit" />
                    <Content className={classStyles.content}>
                      <FrameworkEdit {...props} />
                    </Content>
                  </Layout>
                </Layout>
              )}
            />

            <Route
              path={'/bonds/new'}
              render={props => (
                <Layout>
                  <Sider>
                    <Sidebar />
                  </Sider>
                  <Layout className={classStyles.layout}>
                    <HeaderBack to="/bonds" title="New Bond" />
                    <Content className={classStyles.content}>
                      <BondCreate {...props} />
                    </Content>
                  </Layout>
                </Layout>
              )}
            />
            <Route
              path={'/bonds/:tuid/edit'}
              render={props => (
                <Layout className={classStyles.layout}>
                  <HeaderBack to={'/projects'} title="Project details" />
                  <Content>
                    <BondEdit />
                  </Content>
                </Layout>
              )}
            />
            <Route
              path={'/bonds/:tuid'}
              render={props => (
                <Layout className={classStyles.layout}>
                  <HeaderBack to="/bonds" title="New Bond" />
                  <Content className={classStyles.content}>
                    <BondItem {...props} />
                  </Content>
                </Layout>
              )}
            />
            <Route path="/bonds" component={BondsLayout} />

            <Route
              path={'/pools/new'}
              render={props => (
                <Layout>
                  <Sider>
                    <Sidebar />
                  </Sider>
                  <Layout className={classStyles.layout}>
                    <HeaderBack to="/pools" title="New Pool" />
                    <Content className={classStyles.content}>
                      <PoolCreate {...props} />
                    </Content>
                  </Layout>
                </Layout>
              )}
            />
            <Route
              path={'/pools/:tuid/edit'}
              render={props => (
                <Layout className={classStyles.layout}>
                  <HeaderBack to={`/pools/${props.match.params.tuid}`} />
                  <Content className={classStyles.content}>
                    <PoolEdit {...props} />
                  </Content>
                </Layout>

              )}
            />
            <Route
              path={'/pools/:tuid'}
              render={PoolItemLayout}
            />
            <Route
              path={'/pools'}
              render={PoolsLayout}
            />

            <Route
              path={'/projects/new'}
              render={props => (
                <Layout>
                  <Sider>
                    <Sidebar />
                  </Sider>
                  <Layout className={classStyles.layout}>
                    <HeaderBack to="/projects" title="New Project" />
                    <Content className={classStyles.content}>
                      <ProjectCreate {...props} />
                    </Content>
                  </Layout>
                </Layout>
              )}
            />
            <Route path={'/projects/:tuid/edit'} component={ProjectEditLayout} />
            <Route path={'/projects/:tuid'} component={ProjectItemLayout} />
            <Route path="/projects" component={ProjectsLayout} />

            <Route
              path={'/profile/edit'}
              render={props => (
                <Layout>
                  <Sider>
                    <Sidebar />
                  </Sider>
                  <Layout className={classStyles.layout}>
                    <HeaderBack to="/profile" title="Profile Edit" />
                    <Content className={classStyles.content}>
                      <ProfileEdit {...props} />
                    </Content>
                  </Layout>
                </Layout>
              )}
            />

            <Route path="/profile" component={ProfileLayout} />
            <Route path={'/account'} render={props =>
              <Layout className={classStyles.layout}>
                <HeaderBack to="/projects" title="Project details" />
                <Content className={classStyles.content}>
                  <Account
                    {...props}
                  />
                </Content>
              </Layout>
            } />

            <Route exact path="/login" render={() => <Redirect to="/" />} />
            <Route exact path="/sign-up" render={() => <Redirect to="/" />} />
            <Route exact path="/" render={() => <Redirect to="/profile" />} />
            <Route render={props => <Page404 {...props} />} />
          </Switch>
        </Fragment>
      </Route>
    </Switch>
  )
}

@withRouter
@inject('authStore')
@inject('rootStore')
@observer
class RouterMain extends Component {
  render() {
    const { user } = this.props.authStore
    const { ready } = this.props.rootStore
    if (!ready) {
      return '...Loading'
    }
    if (!user) {
      return <NotAuthenteticatedRouters />
    }
    return <AuthenteticatedRouters issuerTuid={user.tuid} />
  }
}

export default RouterMain
