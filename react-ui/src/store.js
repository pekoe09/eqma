import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import assetTransactionReducer from './reducers/assetTransactionReducer'
import customerReducer from './reducers/customerReducer'
import equipmentReducer from './reducers/equipmentReducer'
import rentalReducer from './reducers/rentalReducer'
import userReducer from './reducers/userReducer'

const reducer = combineReducers({
  assetTransactions: assetTransactionReducer,
  customers: customerReducer,
  equipments: equipmentReducer,
  rentals: rentalReducer,
  users: userReducer
})

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2
}

const persistedReducer = persistReducer(persistConfig, reducer)

export const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
)

export const persistor = persistStore(store)