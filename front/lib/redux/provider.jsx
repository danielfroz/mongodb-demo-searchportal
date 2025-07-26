'use client'

import { Provider as ProviderRedux } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux'

const Provider = ({ children }) => {
  return (
    <ProviderRedux store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </ProviderRedux>
  )
}

export default Provider