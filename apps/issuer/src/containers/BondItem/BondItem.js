import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router'
import { graphql, compose } from 'react-apollo'
import { Spin, Card } from 'antd'
import transformProps from 'transform-props-with'

import {
  bond as bondQuery
} from 'src/queries/queries.gql'
import Projects from 'src/containers/Projects'
import FrameworkView from 'src/containers/Framework/FrameworkView'

@withRouter
@transformProps(oldProps => {
  const { tuid, ...props } = oldProps

  return {
    tuid: tuid || props.match.params.tuid,
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
    const { bondQuery } = this.props

    if (bondQuery.error)
      return (
        <Fragment>
          Error!
          <div>{bondQuery.error ? bondQuery.error.message : () => null}</div>
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
        <FrameworkView framework={bond.framework} loading={bondQuery.loading} />
        <Card
          style={{ marginTop: '14px' }}
          title={
            <div style={{ color: 'rgb(15,48,130)', fontSize: '14px' }}>
              ASSOCIATED PROJECTS
            </div>
          }
        >
          <Projects poolTuid={bond.poolTuid} />
        </Card>
      </div>
    )
  }
}

export default BondItem
