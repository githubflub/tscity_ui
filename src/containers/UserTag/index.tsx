import React from 'react'
import AvatarCircle from 'containers/AvatarCircle'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import './UserTag.scss'

export default function UserTag(props) {
   const { args, user } = useGetSelfQuery();
   const username = (user && user.username) || ''

   return (
      <div className="user_tag">
         <AvatarCircle className="user_tag__avatar_circle" /> <span>{username}</span>
      </div>
   )
}