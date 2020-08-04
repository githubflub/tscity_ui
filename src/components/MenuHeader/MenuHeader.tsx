import React from 'react'
import classnames from 'classnames'
import './MenuHeader.scss'

export function MenuHeader(props) {
   const {
      children,
      className,
      ...other
   } = props;

   return (
      <div {...other} className={classnames("MenuHeader", className)}>
         {children}
      </div>
   )
}