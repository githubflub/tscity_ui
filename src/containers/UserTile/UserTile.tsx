import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import HeaderCloseButton from 'components/HeaderCloseButton/HeaderCloseButton'
import { SendMessageButton } from 'containers/SendMessageButton/SendMessageButton';
import { BlockUserButton } from 'containers/BlockUserButton/BlockUserButton'

const UserPaper = withStyles({
   root: {
      backgroundColor: '#1f1f1f',
      color: 'rgba(255,255,255,0.88)',
      width: '100%',
      height: '195px',
   }
})(Paper);

export default function UserTile(props) {
   const {
      user,
      onCloseClick,
      use_internal_url,
      style,
   } = props;

   const url = `/profiles/${user.username}`
   const user_display_name = user.display_name || user.username;

   return (
      <UserPaper elevation={3} style={style}>
         <div>
            {onCloseClick && <HeaderCloseButton onClick={onCloseClick} absolute />}
            {use_internal_url?
               <Link to={url}>{user_display_name}</Link>
               : <a href={url} target="_blank">{user_display_name}</a>
            }
            <SendMessageButton user={user} />
            <BlockUserButton user={user} />
         </div>
      </UserPaper>
   )
}