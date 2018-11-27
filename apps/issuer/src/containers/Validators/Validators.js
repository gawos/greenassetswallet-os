import React, { PureComponent, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'

import TitleCard from 'src/_components/TitleCard'
import ValidatorsTable from './ValidatorsTable'

import { users as usersQuery } from 'src/queries/queries.gql'

@compose(
  graphql(usersQuery, {
    options: () => ({
      variables: {
        filter: {
          role: 'validator'
        }
      }
    }),
    name: 'validatorsQuery'
  })
)
class Validators extends PureComponent {
  render() {
    const { validatorsQuery } = this.props

    if (validatorsQuery.error) {
      return (
        <Fragment>
          Error!
          <div>{validatorsQuery.error ? validatorsQuery.error.message : null}</div>
        </Fragment>
      )
    }

    const { users = [] } = validatorsQuery

    return (
      <Fragment>
        <TitleCard title="Validators" />
        <div className="content-wrapper">
          <ValidatorsTable validators={users} loading={validatorsQuery.loading} isExpandable />
        </div>
      </Fragment>
    )
  }
}

export default Validators
