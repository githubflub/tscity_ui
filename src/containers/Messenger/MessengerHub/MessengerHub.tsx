import React from 'react'
import MessengerTab from '../MessengerTab/MessengerTab'
import MessengerSlider from '../MessengerSlider/MessengerSlider'
import { useSelector, useDispatch } from 'react-redux'
import {
   toggleMessengerHubSlider
} from 'redux_store/modules/messenger/messenger'
import MessengerInnerHub from '../MessengerInnerHub/MessengerInnerHub'

import './MessengerHub.scss'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'

export default function MessengerHub(props) {
   const dispatch = useDispatch();
   const { is_messenger_hub_open } = useSelector(state => state.messenger);
   const { message_notifications } = useGetSelfQuery();



   return (
      <MessengerSlider
         use_outside_state
         is_open={is_messenger_hub_open}
         onTabClick={() => dispatch(toggleMessengerHubSlider())}
         PullTab={
            <MessengerTab
               label={message_notifications.length
                  ? <div>{"Messenger"}&nbsp;{`(${message_notifications.length})`}</div>
                  : "Messenger"
               }

            />
         }
         WithRespectTo={
            <div style={{ height: '100%', width: '200px' }}>
               <MessengerInnerHub />
            </div>
         }
      />
   )
}