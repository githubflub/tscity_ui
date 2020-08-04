import React from 'react'
import { useSelector } from 'react-redux';
import { useIsMobile } from 'hooks/useIsMobile'
import DesktopMessenger from './DesktopMessenger/DesktopMessenger'
import MobileMessenger from './MobileMessenger/MobileMessenger'
import './Messenger.scss'

export default function Messenger(props) {
   const { mobile, desktop } = props;
   const is_mobile = useIsMobile();
   const session = useSelector(state => state.session)

   if (!session.login_status_checked || !session.is_authenticated) {
      return null;
   }

   if (mobile && is_mobile) {
      return <MobileMessenger />
   }
   else if (desktop && !is_mobile) {
      return <DesktopMessenger />
   }

   return null
}