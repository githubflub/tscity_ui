import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'
import Paper from '@material-ui/core/Paper';
import HeaderCloseButton from 'components/HeaderCloseButton/HeaderCloseButton'
import { SendMessageButton } from 'containers/SendMessageButton/SendMessageButton';
import { BlockUserButton } from 'containers/BlockUserButton/BlockUserButton'
import AvatarCircle from 'containers/AvatarCircle/AvatarCircle'
import UserTag from 'containers/UserTag/UserTag'

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
      ...other
   } = props;

   const url = `/profiles/${user.username}`
   const user_display_name = user.display_name || user.username;
   const name_style = {
      fontSize: "24px",
      color: "rgba(255, 255, 255, 0.8)",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
   }

   return (
      <div {...other}>
         {onCloseClick && <HeaderCloseButton onClick={onCloseClick} absolute />}
         <UserTag user={user} style={{ paddingLeft: "10px", paddingTop: "10px" }} />
         <div style={{
            display: "flex",
            padding: "10px 10px 0px",
            flexWrap: "wrap",
         }}>
            <SendMessageButton user={user} style={{ marginBottom: "10px" }} />
            <div style={{ width: "10px", minWidth: "10px" }}/>
            <BlockUserButton user={user} style={{ marginBottom: "10px" }} />
         </div>
      </div>
   )
}