import React, { PureComponent, Fragment } from 'react'
import { withRouter } from 'react-router'
import { compose, graphql } from 'react-apollo'
import transformProps from 'transform-props-with'
import { Spin, Card } from 'antd'

import TitleCard from 'src/_components/TitleCard'
import ValidatorItemView from './ValidatorItemView'

import { user as userQuery } from 'src/queries/queries.gql'

@withRouter
@transformProps(oldProps => {
  const { tuid, ...props } = oldProps

  return {
    tuid: tuid || props.match.params.tuid,
    ...props
  }
})
@compose(
  graphql(userQuery, {
    options: ({ tuid }) => ({ variables: { tuid } }),
    name: 'validatorQuery'
  })
)
class ValidatorItem extends PureComponent {
  render() {
    const { validatorQuery } = this.props

    if (validatorQuery.error) {
      return (
        <Fragment>
          Error!
          <div>{validatorQuery.error ? validatorQuery.error.message : null}</div>
        </Fragment>
      )
    }

    if (validatorQuery.loading) {
      return (
        <Fragment>
          <TitleCard title="Validator" />
          <div className="content-wrapper">
            <Card className="empty-card">
              <Spin size="large" />
            </Card>
          </div>
        </Fragment>
      )
    }

    const { user } = validatorQuery

    return (
      <Fragment>
        <TitleCard title={user.name} />
        <div className="content-wrapper">
          <ValidatorItemView validator={user} />
        </div>
      </Fragment>
    )
  }
}

export default ValidatorItem
