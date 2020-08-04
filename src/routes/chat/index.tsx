import React, { useEffect } from 'react'
import TSChat from 'TeenSpotChatClient'
import { TSChatClient } from 'TeenSpotChatClient/client/TSChatClient'

import 'layouts/AppLayout/AppLayout.scss'
import './chat.scss'

function Chat(props) {

   useEffect(() => {
      // Scroll up on route change
      window.scrollTo(0, 0);
   }, [])

   const onClick = () => {
      console.log("Purposeful disconnect...");
      TSChatClient.disconnect();
   }


   return (
      <div className="teenspot_app_layout__page chat_page">
         <div className="teenspot_app_layout__page_container">
            <TSChat />
            {/* <button onClick={onClick}>Disconnect...</button> */}
         </div>
      </div>
   )
}

export default Chat