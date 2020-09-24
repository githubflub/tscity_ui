import React from 'react'
import classnames from 'classnames'
import UserTag from 'containers/UserTag/UserTag'
import HeaderCloseButton from 'components/HeaderCloseButton/HeaderCloseButton'

import './UserItem.scss';

export default function UserItem(props) {
   const {
      className,
      dark_mode,
      user,
      right_side_items,
      onCloseClick,

      /*
         Changes wrapping behavior to wrap
         at pre-defined breakpoints. One
         day, I may allow caller to specify
         their own breakpoint. Idk.
      */
      use_breakpoints,

      /*
         Flag forces component to always be wrap.
      */
      always_wrapped,
      ...other
   } = props

   return (
      <div
         {...other}
         className={classnames("UserItem", className, {
            "UserItem__use_breakpoints": use_breakpoints,
            "UserItem__always_wrapped": always_wrapped,
         })}
      >
         <div className="UserItem__left">
            <UserTag user={user} dark_mode={dark_mode} />
         </div>
         <div className="UserItem__right">
            <div className="UserItem__gutter_wrapper">
               {right_side_items}
            </div>
         </div>
         {onCloseClick && <HeaderCloseButton onClick={onCloseClick} absolute />}
      </div>
   )
}