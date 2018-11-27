import { create } from 'mobx-persist'
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
    const userPersistentStorageJSON = localStorage.getItem('authStore')
    let userPersistentStorage = {}
    try {
      userPersistentStorage = JSON.parse(userPersistentStorageJSON) || {}
    } catch (err) {
      localStorage.removeItem('authStore')
    }
    this.authStore = new Auth(userPersistentStorage)
    hydrate('authStore', this.authStore).then(() =>
      // eslint-disable-next-line no-console
      console.log('observable s hydrated')
    )
  }

  graphQlInit = () => {
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          // eslint-disable-next-line no-console
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
        )

      if (networkError) {
        if (networkError.statusCode === 401) {
          this.authStore.logout()
        }
        // eslint-disable-next-line no-console
        console.log(`[Network error]: ${networkError}`)
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
    this.apolloClient = new ApolloClient({
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
        },
        mutate: { errorPolicy: 'all' }
      }
    })
  }

  init = async () => {
    this.graphQlInit()
    await this.authStore.init()
  }
}

const root = new Root()
root.init()

export default root
