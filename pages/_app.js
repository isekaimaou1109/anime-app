import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ChakraProvider } from '@chakra-ui/react'
import Head from 'next/head'

import '../styles/global.scss'
import createStore from '../store'

function MyApp({ Component, pageProps }) {
  const { store, persistor } = createStore()

  return <React.Fragment>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  </React.Fragment>
}

export default MyApp
