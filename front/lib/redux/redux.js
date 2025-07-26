'use client'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import * as r from './index'

let persistedReducer = {}
const persistConfig = {
  key: 'root',
  storage
}

const appReducer = combineReducers({
  patient: r.patient,
  tenant: r.tenant,
})

persistedReducer = persistReducer(persistConfig, appReducer)
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ]
      }
    })
})
const persistor = persistStore(store)

export { persistor, store }
