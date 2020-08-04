import React from 'react'
import './DecoratedUsername.scss'

export default function DecoratedUsername(props) {
   const { badge, username, message } = props

   return (
      <React.Fragment>
         {badge && <img className="DecoratedUsername_badge" src={badge} />}
         {username && <span className="DecoratedUsername_badge">{username}</span>}
         {message && <span className="DecoratedUsername_badge">{message}</span>}
      </React.Fragment>
   )
}