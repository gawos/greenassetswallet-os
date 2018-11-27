import { create } from 'mobx-persist'
import { observable } from 'mobx'
//apollo stuf
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { ApolloLink } from 'apollo-link'

import { setContext } from 'apollo-link-context'
import { createUploadLink } from 'apollo-upload-client'
import { onError } from 'apollo-link-error'

//app modules
import Auth from './Auth'
import config from 'config/index'

const uploadLink = createUploadLink({
  uri: `${config.api}/graphql`
})

const hydrate = create({
  storage: window.localStorage, // or AsyncStorage in react-native.
  // default: localStorage
  jsonify: true // if you use AsyncStorage, here shoud be true
  // default: true
})
export class Root {
  constructor() {
    this.graphQlInit()
    this.authStore = new Auth(this.apolloClient)
    this.stores = { authStore : this.authStore, rootStore: this }
  }

  @observable
  ready = null

  graphQlInit = () => {
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          // eslint-disable-next-line no-console
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        )

      if (networkError) {
        if (networkError.statusCode === 401) {
          this.authStore.logout()
        }
        // eslint-disable-next-line no-console
        console.error(`[Network error]: ${networkError}`)
      }
    })
    const authLink = setContext((_, { headers }) => {
      // get the authentication token from local storage if it exists
      const token = this.authStore.user.jwt
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : ''
        }
      }
    })
    const client = new ApolloClient({
      link: ApolloLink.from([errorLink, authLink, uploadLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'ignore'
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        }
      }
      //defaultOptions
      //uri: 'http://localhost:3030/graphql'
    })

    this.apolloClient = client
  }

  init = async () => {
    await hydrate('authStore', this.authStore)

    await this.authStore.init()
    this.ready = true
  }
}

const root = new Root()
root.init()

export default root
