import React from 'react'
import MenuPopper from 'components/MenuPopper'
import MenuItem from '@material-ui/core/MenuItem';
import AvatarCircle from 'containers/AvatarCircle/AvatarCircle'
import UserTag from 'containers/UserTag/UserTag'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { teenspotSignOut } from 'redux_store/modules/session'
import { useScreenSize } from 'hooks/useScreenSize';
import { useNavMenu } from '../../useNavMenu'
import { MenuHeader } from 'components/MenuHeader/MenuHeader'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import './UserMenu.scss'

const NAME = 'UserMenu';

export function useUserMenu() {
   const history = useHistory();
   const dispatch = useDispatch();
   const [screen_width] = useScreenSize();
   const { user: self } = useGetSelfQuery();
   const {
      open_menu_name,
      handleClick,
      handleClose
   } = useNavMenu(NAME);

   const { identity } = useSelector(state => state.session)
   const anchor_ref = React.useRef(null);

   let username = (identity && identity['cognito:username']) || '';

   const handleRouteLink = path => {
      history.push(path);
      handleClose();
   }

   const menu_list = [
      <MenuItem key={1} onClick={() => handleRouteLink('/dashboard')}>Dashboard</MenuItem>,
      <MenuItem key={2} onClick={() => handleRouteLink('/profiles/' + username)}>View Your Profile</MenuItem>,
      <MenuItem key={3} onClick={() => { dispatch(teenspotSignOut()); handleClose(); }}>Logout</MenuItem>
   ]

   const menu_content = (
      <React.Fragment>
         <MenuHeader>
            <UserTag
               user={self}
               use_internal_url
               onUsernameClick={handleClose}
               style={{
                  paddingTop: "10px"
               }}
            />
         </MenuHeader>

         {menu_list}
      </React.Fragment>
   )

   return {
      UserMenu: (
         <React.Fragment>
            <AvatarCircle
               id={"user_menu_button"}
               ref={anchor_ref}
               className="user_menu__button"
               onClick={handleClick}
            />
            <MenuPopper
               anchorEl={anchor_ref.current}
               open={open_menu_name === NAME && !!anchor_ref.current && screen_width > MOBILE_SIZE}
               onClose={handleClose}
               className="TSBase__dark"
               placement="bottom-end"
               style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '0px',
                  width: '320px',
                  // height: '480px',
               }}
            >
               {menu_content}
            </MenuPopper>
         </React.Fragment>
      ),
      UM_use_dialog: open_menu_name === NAME && screen_width <= MOBILE_SIZE,
      UserMenuContent: menu_content
   }
}