import React from 'react'
import CloseButtonSpinny from 'components/CloseButtonSpinny'
import SlideMenu from 'components/SlideMenu/SlideMenu'

import './TwitchSlideMenu.scss'

export default function TwitchUsersSlideMenu(props) {
   const { title, open, onClose } = props

   return (
      <SlideMenu open={open}>
         <section className="ts_twitch_chat__slide_menu">
            <header className="ts_twitch_chat__slide_menu_header">
               {title}
               <CloseButtonSpinny onClick={onClose}/>
            </header>
            {props.children}
         </section>
      </SlideMenu>
   );
}