import React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import NotificationsIcon from '@material-ui/icons/Notifications';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { useScreenSize } from 'hooks/useScreenSize';
import MenuPopper from 'components/MenuPopper';
import { useNavMenu } from 'containers/Navbar/useNavMenu';
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import { useHistory } from 'react-router-dom'
import { useFriendRequests } from 'hooks/useFriendRequests'
import FriendRequestItem from 'containers/FriendRequestItem/FriendRequestItem'
import NotificationMenuItem from './NotificationMenuItem/NotificationMenuItem'
import MenuList from '@material-ui/core/MenuList';
import ChatScrollContainer from 'TeenSpotChatClient/gui/shared/ChatScrollContainer/ChatScrollContainer'
import { MenuHeader } from 'components/MenuHeader/MenuHeader'
import MenuItemNotButton from 'components/MenuItemNotButton';

const NAME = 'NotificationsMenu'

export function useNotificationsMenu() {
   const [ screen_width ] = useScreenSize();
   const history = useHistory();
   const anchor_ref = React.useRef(null);
   const { notifications } = useGetSelfQuery();

   const {
      rejectFriendRequest,
      acceptFriendRequest,
      friend_requests_loading,
   } = useFriendRequests()

   const {
      open_menu_name,
      handleClick,
      handleClose
   } = useNavMenu(NAME);

   const onFriendRequestClick = (event) => {
      history.push('/dashboard/friend_requests')
      handleClose(event);
   }

   const menu_list = notifications
      .reduce((sum, item) => {
         switch (item.type) {
            case 'friend_request': {
               const sender = {
                  id: item.data.sender_user_id,
                  username: item.data.sender_username,
               }

               // for (let i = 0; i < 1; i++) {
                  sum.push(
                     <NotificationMenuItem
                        key={sum.length}
                        label="Friend Request"
                        onClick={onFriendRequestClick}
                        style={{
                           padding: '6px 16px',
                           position: 'relative',
                           minHeight: '100px'
                        }}
                     >
                        <FriendRequestItem
                           small
                           friend_request={item.data}
                           sender={sender}
                           loading={friend_requests_loading}
                           acceptFriendRequest={acceptFriendRequest}
                           rejectFriendRequest={rejectFriendRequest}
                        />
                     </NotificationMenuItem>
                  )
                  // This is so dumb but ok.
                  sum.push(
                     <div key={`border_${sum.length}`} className="ts_border_bottom" />
                  )
               // }
            }
            default:
               return sum;
         }
      }, [])


   if (!menu_list.length) {
      menu_list.push(<MenuItemNotButton key={0}>No Notifications</MenuItemNotButton>);
   }

   const is_popper_open = open_menu_name === NAME && !!anchor_ref.current && screen_width > MOBILE_SIZE

   const menu_content = (
      <React.Fragment>
         <MenuHeader className="ts_border_bottom">{"Notifications"}</MenuHeader>
         <ChatScrollContainer no_stick>
            <MenuList
               autoFocusItem={is_popper_open}
               onKeyDown={event => {
                  if (event.key === 'Esc' || event.key === 'Tab') {
                     event.preventDefault();
                     handleClose();
                  }
               }}
               style={{
                  padding: '0px',
                  height: '100%',
                  overflow: 'auto'
               }}
            >
               {menu_list}
            </MenuList>
         </ChatScrollContainer>
      </React.Fragment>
   )

   return {
      NotificationsMenu: (
         <React.Fragment>
            <IconButton
               ref={anchor_ref}
               id="notifications_menu_button"
               color="inherit"
               onClick={handleClick}
            >
               <Badge badgeContent={notifications.length} color="secondary">
                  <NotificationsIcon color="primary" />
               </Badge>
            </IconButton>
            <MenuPopper
               anchorEl={anchor_ref.current}
               open={is_popper_open}
               className="TSBase__dark"
               onClose={handleClose}
               placement="bottom-end"
               style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '0px',
                  width: '320px',
                  height: '480px',
               }}
            >
               {menu_content}
            </MenuPopper>
         </React.Fragment>
      ),
      NM_use_dialog: open_menu_name === NAME && screen_width <= MOBILE_SIZE,
      NotificationsMenuContent: menu_content
   }
}