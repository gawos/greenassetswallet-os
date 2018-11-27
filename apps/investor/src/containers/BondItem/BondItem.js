import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { graphql, compose } from 'react-apollo'
import { Card } from 'antd'
import transformProps from 'transform-props-with'

//app modules
import {
  bond as bondQuery,
  projects as projectsQuery
} from 'src/queries/queries.gql'
import Projects from 'src/containers/Projects/_Projects'


@transformProps(oldProps => {
  const { tuid, ...props } = oldProps

  const ProjectsContainer = compose(
    graphql(projectsQuery, {
      name: 'itemsQuery',
      options: ({ poolTuid }) => ({
        variables: {
          filter: {
            pool: poolTuid
          }
        }
      })
    })
  )(Projects)

  return {
    tuid: tuid || props.match.params.tuid,
    ProjectsContainer,
    ...props
  }
})
@withRouter
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

    if (bondQuery.loading) return 'loading ....'
    const { bond } = bondQuery
    if (!bond && !bondQuery.loading) {
      return (
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          Bond does not exists or was removed
        </div>
      )
    }

    return (
      <div style={{ ...this.props.style }}>
        <div style={{ height: '10px' }} />
        <Card
          style={{ marginTop: '14px' }}
          title={
            <div style={{ color: 'rgb(15,48,130)', fontSize: '14px' }}>
              ASSOCIATED PROJECTS
            </div>
          }
        >
          <ProjectsContainer poolTuid={bond.poolTuid} />
        </Card>
      </div>
    )
  }
}

export default BondItem
