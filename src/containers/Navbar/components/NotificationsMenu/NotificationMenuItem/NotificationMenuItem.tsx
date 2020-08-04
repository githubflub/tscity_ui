import React from 'react'
import classnames from 'classnames'
import './TSMenuItem.scss'

export default function NotificationMenuItem(props) {
   const {
      children,
      label,
      className,
      ...other
   } = props

   return (
      <li
         {...other}
         className={classnames("TSMenuItem TSMenuItem__clickable", className)}
         style={{
            display: 'block',
            whiteSpace: 'normal',
            ...other.style,
         }}
      >
         <div style={{ fontSize: '12px', marginBottom: '10px' }}>{label && label}</div>
         {children}
      </li>
   )
}