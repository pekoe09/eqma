import loginService from '../services/login'

let user = JSON.parse(localStorage.getItem('user'))
const initialState = user ? { loggedIn: true, user } : {}

const loginReducer = (store = initialState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        loggedIn: true,
        user: action.user
      }
    case 'LOGOUT':
      return {}
    default:
      return store
  }
}

export const login = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials)
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({
      type: 'LOGIN',
      user
    })
  }
}

export const logout = () => {
  return async (dispatch) => {
    await loginService.logout()
    localStorage.clear()
    dispatch({ type: 'LOGOUT' })
  }
}

export default loginReducer