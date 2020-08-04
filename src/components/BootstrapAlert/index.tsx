import * as React from 'react'
import classnames from 'classnames'

import './BootstrapAlert.scss'

function BootstrapAlert(props) {
   const { children, show, status, className, ...other_props } = props
   if (!show) {
      return null; 
   }

   const alert_classname = classnames({
      "teenspot_alert": true, 
      [`teenspot_alert__${status}`]: !!status
   })

   return (
      <div className={alert_classname} {...other_props}>{children}</div>
   )
}

BootstrapAlert.displayName = 'BootstrapAlert'

export default BootstrapAlert