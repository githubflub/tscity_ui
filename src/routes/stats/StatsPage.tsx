import React, { useState, useEffect } from 'react'
import 'layouts/AppLayout/AppLayout.scss'
import './StatsPage.scss'

function Stats(props) {
   useEffect(
      () => {
         // Scroll up on route change
         window.scrollTo(0, 0);
      },
      []
   )

   return (
      <div>
         Stats page!!
      </div>
   )
}

export default Stats
