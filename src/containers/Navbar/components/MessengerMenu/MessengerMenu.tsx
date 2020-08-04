import React from 'react'
import { useNavMenu } from 'containers/Navbar/useNavMenu';
import { useScreenSize } from 'hooks/useScreenSize';
import IconButton from '@material-ui/core/IconButton';
import MessageIcon from '@material-ui/icons/Message';
import Badge from '@material-ui/core/Badge';
import Messenger from 'containers/Messenger/Messenger'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'

const NAME = 'MessengerMenu'

export function useMessengerMenu() {
   const [ screen_width ] = useScreenSize();
   const {
      open_menu_name,
      handleClick,
      handleClose
   } = useNavMenu(NAME);
   const { message_notifications } = useGetSelfQuery();

   return {
      MessengerMenu: (
         <IconButton
            id="messenger_menu_button"
            color="inherit"
            onClick={handleClick}
         >
            <Badge badgeContent={message_notifications.length} color="secondary">
               <MessageIcon color="primary" />
            </Badge>
         </IconButton>
      ),
      MM_use_dialog: open_menu_name === NAME && screen_width < TABLET_SIZE,
      MessengerMenuContent: <Messenger mobile />
   }
}