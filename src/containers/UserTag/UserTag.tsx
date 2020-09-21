import React from 'react'
import AvatarCircle from 'containers/AvatarCircle/AvatarCircle'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import './UserTag.scss'

export default function UserTag(props) {
   const {
      use_internal_url,
      user,
      onUsernameClick,
      className,
      ...other
   } = props;
   const user_display_name = user
      ? user.display_name || user.username
      : ''
   const url = `/profiles/${user.username}`

   return (
      <div {...other} className={classnames("user_tag", className)}>
         <AvatarCircle className="user_tag__avatar_circle" />
         {use_internal_url
            ? <span onClick={onUsernameClick}>
               <Link to={url} className="user_tag__name">{user_display_name}</Link>
              </span>
            : <a href={url} target="_blank" className="user_tag__name">{user_display_name}</a>
         }
      </div>
   )
}