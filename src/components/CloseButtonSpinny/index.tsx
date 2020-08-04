import React from 'react'
import classnames from 'classnames'
import './CloseButtonSpinny.scss'

export default function CloseButtonSpinny(props) {
   const {
      className,
      ...other_props
   } = props;

   const button_classname = classnames('CloseButtonSpinny', props.className);

   return (
      <span className={button_classname} {...other_props} />
   )
}