import React from 'react'
import { SendMessageButton } from 'containers/SendMessageButton/SendMessageButton';
import { BlockUserButton } from 'containers/BlockUserButton/BlockUserButton'
import UserItem from 'components/UserItem/UserItem'


export default function UserTile(props) {
   const {
      user,
      onCloseClick,
      use_internal_url,
      always_wrapped,
      dark_mode,
      ...other
   } = props;

   return (
      <UserItem
         dark_mode={dark_mode}
         always_wrapped={always_wrapped}
         user={user}
         onCloseClick={onCloseClick}
         right_side_items={
            <React.Fragment>
               <SendMessageButton user={user} />
               <BlockUserButton user={user} />
            </React.Fragment>
         }
         {...other}
      />
   )
}