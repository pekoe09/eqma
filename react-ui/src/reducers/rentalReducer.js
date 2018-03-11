import rentalService from '../services/rentals'

const rentalReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_RENTALS':
      return action.rentals
    case 'CREATE_RENTAL':
      return store.concat(action.newRental)
    case 'REMOVE_RENTAL':
      return store.filter(r => r._id !== action.id)
    default:
      return store
  }
}

export const createRental = (rental) => {
  return async (dispatch) => {
    const newRental = await rentalService.createNew(rental)
    dispatch({
      type: 'CREATE_RENTAL',
      newRental
    })
  }
}

export const initializeRentals = () => {
  return async (dispatch) => {
    const rentals = await rentalService.getAll()
    dispatch({
      type: 'INIT_RENTALS',
      rentals
    })
  }
}

export const removeRental = (id) => {
  return async (dispatch) => {
    await rentalService.remove(id)
    dispatch({
      type: 'REMOVE_RENTAL',
      id
    })
  }
}

export default rentalReducer