import customerService from '../services/customers'

const customerReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_CUSTOMERS':
      return action.customers
    case 'CREATE_CUSTOMER':
      return store.concat(action.newCustomer)
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

export const initializeCustomers = () => {
  return async (dispatch) => {
    const customers = await customerService.getAll()
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