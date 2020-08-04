import { prepareNewDMs } from 'hooks/Messenger/prepareNewDMs'
import { GET_SELF_QUERY, GET_SELF_QUERY_TYPE } from 'apollo/query/GET_SELF_QUERY'
import { getOppositeUser } from 'utils/getOppositeUser'
import { upgradeConversation, updateConversationLocalReadTime } from 'redux_store/modules/messenger/messenger'

export function onReceiveDM(tools, response) {
   const { apollo_client, dispatch, getState } = tools;

   // Throws an error if query not in cache.
   let data;
   try {
      data = apollo_client.readQuery({ query: GET_SELF_QUERY });
   }
   catch (error) {
      // Assume query wasn't in the cache.
      // Meaning there's nothing to update.
      return;
   }

   const { thread, message } = response;
   const { getMyDMs, getSelf: self }: GET_SELF_QUERY_TYPE = data
   const new_dms = prepareNewDMs(getMyDMs, response)

   apollo_client.writeQuery({
      query: GET_SELF_QUERY,
      data: {
         ...data,
         getMyDMs: new_dms,
      }
   })

   // Need to upgrade conversation.
   // This means add thread_id.
   const opposite_user = getOppositeUser(thread, self)
   const state = getState();
   const open_conversations = state.messenger.open_conversations;
   const convo = open_conversations.find(item => item.target_user_id === opposite_user.id)
   if (convo) {
      const upgraded_convo = {
         target_user_id: opposite_user.id,
         target_username: opposite_user.username,
         thread_id: thread.id,
         is_open: convo.is_open,
      }

      if (!convo.thread_id && +convo.thread_id !== 0) {
         dispatch(upgradeConversation(upgraded_convo))
      }

      dispatch(updateConversationLocalReadTime(upgraded_convo))
   }
}