import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'

import { frameworks as frameworksQuery } from 'src/queries/queries.gql'

import { Spin } from 'antd'

import FrameworkView from './FrameworkView'

@compose(
  graphql(frameworksQuery, {
    options: props => {
      const tuid = props.tuid
      return {
        variables: {
          filter: {
            issuer: tuid
          }
        }
      }
    },
    name: 'itemQuery'
  })
)
class Framework extends Component {
  get renderActions() {
    const { itemQuery } = this.props
    if (itemQuery.loading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 48px)'
          }}
        >
          <Spin size="large" />
        </div>
      )
    }
    return null
  }

  render() {
    const { itemQuery } = this.props

    if (itemQuery.error)
      return (
        <Fragment>
          Error!
          <div>{itemQuery.error ? itemQuery.error.message : null}</div>
        </Fragment>
      )

    const framework = itemQuery.frameworks && itemQuery.frameworks[0]

    return <FrameworkView framework={framework} actions={this.renderActions} />
  }
}

export default Framework
