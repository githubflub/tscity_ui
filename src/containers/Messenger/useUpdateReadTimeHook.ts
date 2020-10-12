import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useApolloClient } from 'apollo/apollo'
import {
   updateConversationLocalReadTime,
   updateReadTimeAxios,
} from 'redux_store/modules/messenger/messenger'

export function useUpdateReadTimeHook(chat_details) {
   const { id_token } = useSelector(state => state.session);
   const apollo_client = useApolloClient();
   const dispatch = useDispatch();

   React.useEffect(
      () => {
         const { is_open } = chat_details;
         // console.log("READ TIME HOOK", is_open)

         const updateRemoteReadTime = () => {
            // console.log("updateRemoteReadTime is_open", is_open)
            if (is_open) {
               updateReadTimeAxios({ apollo_client, identity_token: id_token }, chat_details)
            }

            // This is here to remove the event listener on refresh.
            // It's possible that this is unnecessary though.
            // However, it also removes the event listener on
            // normal unmounting, which is needed.
            window.removeEventListener('beforeunload', updateRemoteReadTime);
         }

         window.addEventListener('beforeunload', updateRemoteReadTime);

         if (is_open) {
            dispatch(updateConversationLocalReadTime(chat_details))
         }

         return () => updateRemoteReadTime()
      },
      [chat_details]
   )
}