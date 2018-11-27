import { inject } from 'mobx-react'
import { compose, graphql } from 'react-apollo'
import BondView from './BondView'
import { bonds as bondsQueryTmpl } from 'src/queries/queries.gql'


const Bonds = inject('authStore')(compose(
  graphql(bondsQueryTmpl, {
    options:  ({ authStore, poolTuid, poolNot }) => {
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
    },
    name: 'bondsQuery'
  })
)(BondView))

export default Bonds
