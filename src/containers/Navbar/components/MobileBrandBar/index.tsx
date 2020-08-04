import React from 'react'
import './MobileBrandBar.scss'

export default function MobileBrandBar(props) {
   const { items = [] } = props

   return (
      <div className="mobile_brand_bar">
         {items.map((item, i) => (
            <div key={i} className="mobile_brand_bar__button_container">
               {item}
            </div>
         ))}
      </div>
   )
}