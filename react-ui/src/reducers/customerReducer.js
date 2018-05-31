import customerService from '../services/customers'

const customerReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_CUSTOMERS':
      return action.customers
    case 'CREATE_CUSTOMER':
      return store.concat(action.newCustomer)
    case 'UPDATE_CUSTOMER':
      return store.map(c => c._id !== action.updatedCustomer._id ? c : action.updatedCustomer)
    case 'REMOVE_CUSTOMER':
      return store.filter(c => c._id !== action.id)
    default:
      return store
  }
}

export const createCustomer = (customer) => {
  return async (dispatch) => {
    const newCustomer = await customerService.createNew(customer)
    dispatch({
      type: 'CREATE_CUSTOMER',
      newCustomer
    })
  }
}

export const register = (customer) => {
  return async (dispatch) => {
    const newCustomer = await customerService.register(customer)
    dispatch({
      type: 'CREATE_CUSTOMER',
      newCustomer
    })
  }
}

export const updateCustomer = (customer) => {
  return async (dispatch) => {
    const updatedCustomer = await customerService.update(customer)
    dispatch({
      type: 'UPDATE_CUSTOMER',
      updatedCustomer
    })
  }
}

export const initializeCustomers = () => {
  return async (dispatch) => {
    const customers = await customerService.getAll()
    dispatch({
      type: 'INIT_CUSTOMERS',
      customers
    })
  }
}

export const initializeSelfAsCustomer = () => {
  return async (dispatch) => {
    const customers = await customerService.getSelf()
    dispatch({
      type: 'INIT_CUSTOMERS',
      customers
    })
  }
}

export const removeCustomer = (id) => {
  return async (dispatch) => {
    await customerService.remove(id)
    dispatch({
      type: 'REMOVE_CUSTOMER',
      id
    })
  }
}

export default customerReducer