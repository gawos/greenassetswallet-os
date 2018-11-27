import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import { inject } from 'mobx-react'

import { frameworks as frameworksQuery } from 'src/queries/queries.gql'

import { Spin } from 'antd'

import LinkBtn from 'src/_components/LinkBtn'
import FrameworkView from './FrameworkView'

@inject('authStore')
@compose(
  graphql(frameworksQuery, {
    options: ({authStore}) => {
      const { tuid } = authStore.user
      return {
        variables: {
          filter: {
            issuer: tuid
          }
        }
      }
    },
    name: 'frameworksQuery'
  })
)
class Framework extends Component {
  get renderActions() {
    const { frameworksQuery, renderActions } = this.props
    if (frameworksQuery.loading) {
      return (
        <div><Spin size="large" /></div>
      )
    }

    const framework = frameworksQuery.frameworks[0]

    if (!framework)
      return (
        <LinkBtn
          primary
          ghost
          size="sm"
          icon="plus"
          to={'/frameworks/new'}
          text="Create Framework"
        />
      )

    if (renderActions)
      return typeof renderActions === 'function'
        ? renderActions(framework)
        : renderActions

    return (
      <LinkBtn
        primary
        ghost
        size="sm"
        icon="edit"
        to={`/frameworks/${framework.tuid}/edit`}
        text="Edit Framework"
      />
    )
  }

  render() {
    const { frameworksQuery, className } = this.props

    if (frameworksQuery.error)
      return (
        <Fragment>
          Error!
          <div>{frameworksQuery.error ? frameworksQuery.error.message : null}</div>
        </Fragment>
      )

    const framework = frameworksQuery.frameworks && frameworksQuery.frameworks[0]

    return (
      <FrameworkView
        framework={framework}
        actions={this.renderActions}
        className={className}
        loading={frameworksQuery.loading}
      />
    )
  }
}

export default Framework
