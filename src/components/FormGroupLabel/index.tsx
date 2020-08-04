import * as React from 'react'
import classnames from 'classnames'

import './FormGroupLabel.scss'

function FormGroupLabel(props) {
   const { children, className, ...other_props } = props

   const label_classname = classnames({
      "teenspot_input_label": true, 
      [className]: !!className
   })

   return (
      <label className={label_classname} {...other_props}>{children}</label>
   )
}

FormGroupLabel.displayName = 'FormGroupLabel'

export default FormGroupLabel