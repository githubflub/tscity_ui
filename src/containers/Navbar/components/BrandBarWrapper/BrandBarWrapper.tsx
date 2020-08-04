import React, { useEffect } from 'react'
import { useScreenSize } from 'hooks/useScreenSize'
import { useDispatch } from 'react-redux'
import MobileBrandBar from '../MobileBrandBar'
import NavbarDialog from '../NavbarDialog/NavbarDialog'
import { useUserMenu } from '../UserMenu'
import { useNotificationsMenu } from '../NotificationsMenu'
import BrandBar from '../BrandBar'
import { setIsDialogOpen } from 'redux_store/modules/navbar'
import { useMessengerMenu } from '../MessengerMenu/MessengerMenu'

export default function BrandBarWrapper(props) {
   const { nav_height } = props;
   const dispatch = useDispatch();
   const [screen_width] = useScreenSize();
   const {
      UserMenu,
      UserMenuContent,
      UM_use_dialog,
   } = useUserMenu();
   const {
      NotificationsMenu,
      NotificationsMenuContent,
      NM_use_dialog,
   } = useNotificationsMenu();
   const {
      MessengerMenu,
      MessengerMenuContent,
      MM_use_dialog,
   } = useMessengerMenu();

   const is_open = (
      UM_use_dialog
      || NM_use_dialog
      || MM_use_dialog
   );

   useEffect(
      () => {
         dispatch(setIsDialogOpen(is_open))
      },
      [is_open]
   )

   return (
      <React.Fragment>
         {screen_width < TABLET_SIZE
            ? <MobileBrandBar items={[MessengerMenu, NotificationsMenu, UserMenu]} />
            : <BrandBar />
         }
         <NavbarDialog
            nav_height={nav_height}
            is_open={is_open}
         >
            {NM_use_dialog? NotificationsMenuContent
               : UM_use_dialog? UserMenuContent
                  : MM_use_dialog? MessengerMenuContent
                     : <div />
            }
         </NavbarDialog>
      </React.Fragment>
   );
}