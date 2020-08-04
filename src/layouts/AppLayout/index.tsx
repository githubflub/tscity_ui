import React from 'react'
import './AppLayout.scss'

import { LayoutType } from 'layouts/types'

export default function AppLayout(props: LayoutType) {
   const { header, body, script } = props

   return (
      <div className="teenspot_app_layout">
         <a className="skip-link" href="#maincontent">Skip to main</a>
         {script}
         {header}
         <main id="maincontent" className="teenspot_app_layout__body">
            {body}
         </main>
      </div>
   )
}