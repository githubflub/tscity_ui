import React from 'react'
import './MenuItemNotButton.scss'
import classnames from 'classnames'

function MenuItemNotButton(props, ref) {
   const {
      children,
      className,
      ...other
   } = props;

   return (
      <li ref={ref} {...other} className={classnames("menu_item__not_button", className)}>
         {props.children}
      </li>
   )
}

export default React.forwardRef(MenuItemNotButton)