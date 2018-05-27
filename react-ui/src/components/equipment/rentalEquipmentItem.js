import React from 'react'
import ListItemHeader from '../structure/listItemHeader'
import ListItemSubHeader from '../structure/listItemSubHeader'
import ListItemPrice from '../structure/listItemPrice'

const RentalEquipmentItem = ({ equipment }) => {
  return (
    <div>
      <ListItemHeader text={equipment.makeAndModel} />
      <ListItemSubHeader text={equipment.equipmentType.name} />
      <div>{equipment.description}</div>
      <ListItemPrice price={equipment.price} pricingUnit={equipment.timeUnit} />      
    </div>
  )
}

export default RentalEquipmentItem