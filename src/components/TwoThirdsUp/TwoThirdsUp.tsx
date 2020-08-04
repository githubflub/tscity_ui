import React from 'react'
import './TwoThirdsUp.scss'

// Containing div should have
// display: flex;
// flex-direction: column;
export default function TwoThirdsUp(props) {
   const { children } = props;
   return (
      <div className="TwoThirdsUp">
         <div className="TwoThirdsUp_1">
            {children}
         </div>
         <div className="TwoThirdsUp_2" />
      </div>
   )
}