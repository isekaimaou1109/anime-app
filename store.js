import { configureStore, combineReducers, compose } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reduxReset from 'redux-reset'

import formReducer from './features/form/form'
import modalReducer from './features/modal-status/modal'
import switchingReducer from './features/dark-light-status/mode'
import expandingReducer from './features/expand/expand'
import searchReducer from './features/query/search'
import historyReducer from './features/history/history'

const persistConfig = {
  key: 'root',
  storage,
}

const rootReducer = combineReducers({
  modal: modalReducer,
  process: formReducer,
  switching: switchingReducer,
  expanding: expandingReducer,
  searching: searchReducer().search,
  data: searchReducer().data,
  history: historyReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default function createStore() {
  let store = configureStore({
    reducer: persistedReducer
  })
  let persistor = persistStore(store)
  return { store, persistor }
}