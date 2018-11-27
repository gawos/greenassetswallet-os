import { create } from 'mobx-persist'
//apollo stuf
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { createUploadLink } from 'apollo-upload-client'
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
    const errorLink = onError(({ graphQLErrors, networkError, ...rest }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          // eslint-disable-next-line no-console
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        )

      if (networkError) {
        if (networkError.statusCode === 401) {
          this.authStore.logout()
        }
        // eslint-disable-next-line no-console
        console.log(`[Network error]: ${networkError}`)
      }
    })
    // const authLink = setContext((_, { headers }) => {
    //   // get the authentication token from local storage if it exists
    //   const token = this.authStore.user.jwt
    //   // return the headers to the context so httpLink can read them
    //   return {
    //     headers: {
    //       ...headers,
    //       Authorization: token ? `Bearer ${token}` : ''
    //     }
    //   }
    // })
    this.apolloClient = new ApolloClient({
      link: ApolloLink.from([errorLink, uploadLink]),
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
      //uri: 'http://localhost:3030/graphql'
    })
    this.authStore = new Auth(this.apolloClient)
    hydrate('authStore', this.authStore).then(() =>
      // eslint-disable-next-line no-console
      console.log('observable s hydrated')
    )
  }

  init = async () => {
    await this.authStore.init()
  }
}

const root = new Root()

export default root
