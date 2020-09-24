import React from 'react'
import AvatarCircle from 'containers/AvatarCircle/AvatarCircle'
import { Link } from 'react-router-dom'
import classnames from 'classnames'

import './UserTag.scss'

function UserTag(props) {
   const {
      use_internal_url,
      user,
      onUsernameClick,
      className,
      dark_mode,
      ...other
   } = props;
   const user_display_name = user
      ? user.display_name || user.username
      : ''
   const url = `/profiles/${user.username}`

   return (
      <div {...other} className={classnames("UserTag", dark_mode? "UserTag__dark_mode" : undefined, className)}>
         <AvatarCircle className="UserTag__avatar_circle" />
         {use_internal_url
            ? <span onClick={onUsernameClick}>
               <Link to={url} className="UserTag__name">{user_display_name}</Link>
              </span>
            : <a href={url} target="_blank" className="UserTag__name">{user_display_name}</a>
         }
      </div>
   )
}

export default UserTag;