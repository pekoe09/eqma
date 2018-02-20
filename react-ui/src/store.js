import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import userReducer from './reducers/userReducer'

const reducer = combineReducers({
  users: userReducer
})

const store = createStore(
  reducer,
  applyMiddleware(thunk)
)

export default store