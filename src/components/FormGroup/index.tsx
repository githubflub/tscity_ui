import * as React from 'react'
import classnames from 'classnames'
import './FormGroup.scss'

export default function FormGroup(props) {
   const { children, status, ...other_props } = props
   return (
      <div className="teenspot_form_group" {...other_props}>
         {React.Children.map(children, child => {
            if ((child.type.displayName || '').match(/(HelpText|FormGroupLabel)/)) {
               return React.cloneElement(child, {
                  className: status === 'error'? classnames(child.props.className, `teenspot_form_group__${status}`) : child.props.className, 
               })
            }

            if (child.type.displayName === 'BootstrapInput') {
               return React.cloneElement(child, {
                  error: status === 'error'
               })
            }

            return child
         })}
      </div>
   )
}