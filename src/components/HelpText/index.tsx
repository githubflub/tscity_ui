import React from 'react'
import classnames from 'classnames'

import './HelpText.scss'

function HelpText(props) {
   const { children, show, className, error, ...other_props } = props
   if (!show) {
      return null;
   }

   const help_text_classname = classnames({
      "teenspot_help_text": true,
      "teenspot_help_text__error": !!error,
      [className]: !!className
   })

   return (
      <div className={help_text_classname} {...other_props}>{children}</div>
   )
}

HelpText.displayName = 'HelpText'

export default HelpText