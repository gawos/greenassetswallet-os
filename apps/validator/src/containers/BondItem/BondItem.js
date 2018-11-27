import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { graphql, compose } from 'react-apollo'
import { Button, Tooltip, Spin, Card } from 'antd'
import moment from 'moment'
import transformProps from 'transform-props-with'

//app modules
import {
  bond as bondQuery,
  projects as projectsQuery
} from 'src/queries/queries.gql'
import Projects from 'src/containers/Projects'

@withRouter
@transformProps(oldProps => {
  const { tuid, ...props } = oldProps

  const ProjectsContainer = compose(
    graphql(projectsQuery, {
      name: 'itemsQuery',
      options: () => ({
        variables: {}
      })
    })
  )(Projects)

  return {
    tuid: tuid || props.match.params.tuid,
    ProjectsContainer,
    ...props
  }
})
@compose(
  graphql(bondQuery, {
    options: ({ tuid }) => ({
      variables: {
        tuid
      }
    }),
    name: 'bondQuery'
  })
)
class BondItem extends Component {
  create = () => {}

  render() {
    const { bondQuery, ProjectsContainer } = this.props
    if (bondQuery.error)
      return (
        <Fragment>
          Error!
          <div>{bondQuery.error ? bondQuery.error.message : null}</div>
        </Fragment>
      )
    if (bondQuery.loading) {
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

    const { bond } = bondQuery
    if (!bond) {
      return (
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          Bond does not exists or was removed
        </div>
      )
    }
    return (
      <div style={{ ...this.props.style }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '10px'
          }}
        >
          <Tooltip
            placement="topRight"
            trigger="click"
            title={
              <span style={{ color: 'red', fontWeight: '700' }}>
                not implemented yet
              </span>
            }
          >
            <Button type="danger" ghost>
              edit
            </Button>
          </Tooltip>
        </div>

        <Card
          style={{
            display: 'relative',
            zIndex: 100,
            borderRadius: '5px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ color: 'rgb(15,48,130)', fontSize: '22px' }}>
                {bond.isin}
              </div>
            </div>
            <div>
              <div>{moment(bond.dateIssue).format('DD-MM-YYYY')}</div>
              <div>{moment(bond.dateMaturity).format('DD-MM-YYYY')}</div>
            </div>
          </div>

          <div
            style={{
              color: 'rgb(15,48,130)',
              fontSize: '22px'
            }}
          >
            {bond.volume} {bond.currency}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <div style={{ color: 'rgb(143,151,170)', fontSize: '17px' }}>
                Issuer
              </div>
              <div style={{ color: 'rgb(15,48,130)', fontSize: '18px' }}>
                {bond.issuer.name}
              </div>
            </div>
          </div>
        </Card>
        <Card
          style={{ marginTop: '14px' }}
          title={
            <div style={{ color: 'rgb(15,48,130)', fontSize: '14px' }}>
              ASSOCIATED PROJECTS
            </div>
          }
        >
          <ProjectsContainer />
        </Card>
      </div>
    )
  }
}

export default BondItem
