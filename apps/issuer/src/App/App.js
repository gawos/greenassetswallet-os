import React from 'react'
import { Provider } from 'mobx-react'
import { BrowserRouter as Router } from 'react-router-dom'

import { ApolloProvider } from 'react-apollo'
import { LocaleProvider } from 'antd'
import en_US from 'antd/lib/locale-provider/en_US'
//app modules
import root from 'src/stores/root'

import RouterMain from './RouterMain.js'
import './App.css'

const App = () => (
  <Provider {...root.stores}>
    <Router>
      <ApolloProvider client={root.apolloClient}>
        <LocaleProvider locale={en_US}>
          <RouterMain />
        </LocaleProvider>
      </ApolloProvider>
    </Router>
  </Provider>
)

export default App
