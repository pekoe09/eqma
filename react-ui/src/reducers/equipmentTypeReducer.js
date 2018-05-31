import equipmentTypeService from '../services/equipmentTypes'

const equipmentTypeReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_EQUIPMENT_TYPES':
      return action.equipmentTypes
    case 'CREATE_EQUIPMENT_TYPE':
      return store.concat(action.newEquipmentType)
    case 'UPDATE_EQUIPMENT_TYPE':
      return store.map(e => e._id !== action.updatedEquipmentType._id ? e : action.updatedEquipmentType)
    case 'REMOVE_EQUIPMENT_TYPE':
      return store.filter(e => e._id !== action.id)
    default:
      return store
  }
}

export const createEquipmentType = (equipmentType) => {
  return async (dispatch) => {
    const newEquipmentType = await equipmentTypeService.createNew(equipmentType)
    dispatch({
      type: 'CREATE_EQUIPMENT_TYPE',
      newEquipmentType
    })
  }
}

export const updateEquipmentType = (equipmentType) => {
  return async (dispatch) => {
    const updatedEquipmentType = await equipmentTypeService.update(equipmentType)
    console.log('Updated type in reducer')
    console.log(updatedEquipmentType)
    dispatch({
      type: 'UPDATE_EQUIPMENT_TYPE',
      updatedEquipmentType
    })
  }
}

export const initializeEquipmentTypes = () => {
  return async (dispatch) => {
    const equipmentTypes = await equipmentTypeService.getAll()
    dispatch({
      type: 'INIT_EQUIPMENT_TYPES',
      equipmentTypes
    })
  }
}

export const removeEquipmentType = (id) => {
  return async (dispatch) => {
    await equipmentTypeService.remove(id)
    dispatch({
      type: 'REMOVE_EQUIPMENT_TYPE',
      id
    })
  }
}

export default equipmentTypeReducer