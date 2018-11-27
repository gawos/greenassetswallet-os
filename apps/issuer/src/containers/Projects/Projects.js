import { inject } from 'mobx-react'
import { compose, graphql } from 'react-apollo'
import { projects as projectsQueryTmpl } from 'src/queries/queries.gql'
import ProjectsView from './ProjectsView'

export default inject('authStore') (compose(
  graphql(projectsQueryTmpl, {
    name: 'projectsQuery',
    options: ({ authStore, poolTuid, poolNot }) => {
      const { tuid } = authStore.user
      return {
        variables: {
          filter: {
            issuer: tuid,
            pool: poolTuid,
            pool_not: poolNot
          }
        }
      }
    }
  })
) (ProjectsView) )
