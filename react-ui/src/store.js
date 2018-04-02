import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import assetTransactionReducer from './reducers/assetTransactionReducer'
import customerReducer from './reducers/customerReducer'
import equipmentReducer from './reducers/equipmentReducer'
import loginReducer from './reducers/loginReducer'
import rentalReducer from './reducers/rentalReducer'
import userReducer from './reducers/userReducer'

const appReducer = combineReducers({
  assetTransactions: assetTransactionReducer,
  customers: customerReducer,
  equipments: equipmentReducer,
  login: loginReducer,
  rentals: rentalReducer,
  users: userReducer
})

export const rootReducer = (state, action) => {
  if(action.type === 'USER_LOGOUT') {
    Object.keys(state).forEach(key => {
      storage.removeItem(`persist:${key}`)
    })
    state = undefined
  }

  return appReducer(state, action)
}

export const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
)

export const persistor = persistStore(store)