import React from 'react'

const ListItemPrice = ({ price, pricingUnit }) => {
  return (
    <div>
      {price} / {pricingUnit}
    </div>
  )
}

export default ListItemPrice