import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'

import { graphql, compose } from 'react-apollo'
import { Button, Spin, Modal } from 'antd'
import moment from 'moment'
import transformProps from 'transform-props-with'
import Loader from 'react-loader-advanced'
import { observer, inject } from 'mobx-react'
//app modules
import {
  pool as poolQuery,
  projects as projectsQuery,
  bonds as bondsQuery
} from 'src/queries/queries.gql'
import {
  poolLinkBond as poolLinkBondMutation,
  poolLinkProject as poolLinkProjectMutation
} from 'src/queries/mutations.gql'
import Projects from 'src/containers/Projects'
import ProjectsView from 'src/containers/Projects/ProjectsView'
import BondsView from 'src/containers/Bonds/BondsView'
import Bonds from 'src/containers/Bonds'

@withRouter
@inject('authStore')
@observer
@transformProps(oldProps => {
  const {
    tuid,
    authStore: { user },
    ...props
  } = oldProps
  return {
    tuid: tuid || props.match.params.tuid,
    ...props,
    issuerTuid: user.tuid
  }
})
@compose(
  graphql(poolQuery, {
    options: ({ tuid }) => ({
      variables: {
        tuid
      }
    }),
    name: 'poolQuery'
  }),
  graphql(projectsQuery, { name: 'projectsQuery' }),
  graphql(bondsQuery, { name: 'bondsQuery' }),
  graphql(poolLinkBondMutation, { name: 'poolLinkBondMutation' }),
  graphql(poolLinkProjectMutation, { name: 'poolLinkProjectMutation' })
)
class PoolItem extends Component {
  state = {
    loading: false
  }

  linkBondToPool =  bondTuid => {
    this.setState({ loading: true }, async () => {
      const { tuid } = this.props
      try {
        await this.props.poolLinkBondMutation({
          variables: { tuid, bondTuid },
          refetchQueries: ['pool', 'bonds', 'projects']
        })
      } catch (err) {
        Modal.error({
          title:
            'An error occured, maybe element with this identificator already exists',
          content: err.errors
            ? err.errors.map(error => (
              <div key={error.locations.toString()}>{error.message}</div>
            ))
            : err.toString()
        })
      }
      this.setState({ loading: false })
    })
  }

  linkProjectToPool =  projectId => {
    this.setState({ loading: true }, async () => {
      const { tuid } = this.props
      try {
        await this.props.poolLinkProjectMutation({
          variables: { tuid, projectId },
          refetchQueries: ['pool', 'bonds', 'projects']
        })
      } catch (err) {
        Modal.error({
          title:
            'An error occured, maybe element with this identificator already exists',
          content: err.errors
            ? err.errors.map(error => (
              <div key={error.locations.toString()}>{error.message}</div>
            ))
            : err.toString()
        })
      }
      this.setState({ loading: false })
    })
  }

  renderLinkedBondsAction = () => {}

  renderBondsToChooseAction = (value, record) => (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button
        type="primary"
        ghost
        onClick={() => this.linkBondToPool(record.tuid)}
      >
        link
      </Button>
    </div>
  )
  renderProjectImage = (value) => {
    return <img alt="project" src={value} style={{ width: 100 }} />
  }

  renderProjectsToChooseAction = (value, record) => {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          ghost
          onClick={() => this.linkProjectToPool(record.tuid)}
        >
          link
        </Button>
      </div>
    )
  }

  renderDate = (value) => {
    return moment(value).format('DD-MM-YYY')
  }

  render() {
    const { poolQuery, projectsQuery, bondsQuery, issuerTuid } = this.props
    if (poolQuery.loading || projectsQuery.loading || bondsQuery.loading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Spin size="large" />
        </div>
      )
    }
    if (poolQuery.error || projectsQuery.error || bondsQuery.error)
      return (
        <Fragment>
          Error!
          <div>{poolQuery.error ? poolQuery.error.message : null}</div>
          <div>{projectsQuery.error ? projectsQuery.error.message : null}</div>
          <div>{bondsQuery.error ? bondsQuery.error.message : null}</div>
        </Fragment>
      )

    const { pool } = poolQuery

    if (!pool) {
      return (
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          Pool does not exists or was removed
        </div>
      )
    }
    return (
      <Loader
        contentBlur={1}
        show={this.state.loading}
        message={'SAVING...'}
        messageStyle={{
          fontSize: '30px'
        }}
      >
        <div
          style={{
            border: '1px solid rgba(91,91,91,0.4)',
            padding: '10px'
          }}
        >
          <h2>{pool.name}</h2>
          <div style={{ display: 'flex' }}>
            <div style={{ padding: '10px 20px', flex: 1 }}>
              <ProjectsView
                poolTuid={pool.tuid}
                title={() => (
                  <h3 style={{ textAlign: 'center' }}>Associated Projects</h3>
                )}
                projectsQuery={ { projects: pool.projects }}
              />
            </div>
            <div style={{ padding: '10px 20px', flex: 1 }}>
              <BondsView
                title={() => (
                  <h3 style={{ textAlign: 'center' }}>Associated Bonds</h3>
                )}
                bondsQuery={ { bonds: pool.bonds }}
                renderActions={this.renderLinkedBondsAction}
                poolTuid={pool.tuid}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            paddingTop: '25px',
            justifyContent: 'flex-end'
          }}
        />
        <div style={{ display: 'flex' }}>
          <div style={{ padding: '10px 20px', flex: 1 }}>
            <Projects
              poolNot={pool.tuid}
              title={() => (
                <h3 style={{ textAlign: 'center' }}>Projects to choose</h3>
              )}
              renderActions={this.renderProjectsToChooseAction}
            />
          </div>
          <div style={{ padding: '10px 20px', flex: 1 }}>
            <Bonds
              poolNot={pool.tuid}
              issuerTuid={issuerTuid}
              title={() => (
                <h3 style={{ textAlign: 'center' }}>Bonds to choose</h3>
              )}
              renderActions={this.renderBondsToChooseAction}
            />
          </div>
        </div>
      </Loader>
    )
  }
}

export default PoolItem
