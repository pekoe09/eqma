const initialState = [
  {
    key: 'equipmentType',
    value: ''
  },
  {
    key: 'priceFrom',
    value: 0
  },
  {
    key: 'priceTo',
    value: 0
  }
]

const filterReducer = (store = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return store.map(f => f.key !== action.updatedFilter.key ? f : action.updatedFilter)
    default:
      return store
  }
}

export const setFilter = (updatedFilter) => {
  return (dispatch) => {
    dispatch({
      type: 'SET_FILTER',
      updatedFilter
    })
  }
}

export default filterReducer