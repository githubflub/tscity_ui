import { useSelector } from 'react-redux'
import { useQuery } from '@apollo/react-hooks';
// import { useQuery } from 'apollo-hooks/hooks/src';
import { GET_SELF_QUERY } from 'apollo/query/GET_SELF_QUERY'
import { getOppositeUser } from 'utils/getOppositeUser';
import { arraySortedInsert } from 'utils/arraySortedInsert'

export function useGetSelfQuery() {
   const { identity } = useSelector(state => state.session);
   const username = identity && identity['cognito:username']
   const args = useQuery(GET_SELF_QUERY);
   // console.log("useGetSelfQuery args", args)

   if (args.loading || args.error) {
      args.data = {
         getSelf: {
            username,
         },
         getMyFriendRequests: [],
      }
   }

   const user = (args.data || {}).getSelf
   const blocklist = (args.data || {}).getMyBlockList || []
   const friend_requests_sent = (args.data || {}).getMySentFriendRequests || []

   const friend_requests = (args.data || {}).getMyFriendRequests || []
   const dms = (args.data || {}).getMyDMs || []

   // I don't really like doing this here, but
   // I will filter blocked people here.
   const filtered_friend_requests = friend_requests
      .filter(item => !blocklist.includes(item.sender_user_id))

   const filtered_dms = dms
      .filter(item => {
         const opposite_user = getOppositeUser(item, user);
         return !blocklist.includes(opposite_user.id);
      })

   // Now we need to aggregate(?) notifications.
   const notifications = [];
   for (let i = filtered_friend_requests.length - 1; i >= 0; i--) {
      const fq = filtered_friend_requests[i];
      arraySortedInsert(notifications, {
         type: 'friend_request',
         timestamp: fq.update_time,
         data: fq,
      }, 'timestamp');
   }

   const message_notifications = []
   for (let i = 0; i < filtered_dms.length; i++) {
      const dm = filtered_dms[i];
      const last_read_time = dm.last_read_time;
      if (!last_read_time) {
         message_notifications.push(dm.id)
         continue;
      }

      let last_message;

      for (let j = dm.messages.length - 1; j >= 0; j--) {
         const message = dm.messages[j];
         if (message.sender.id === user.id) {
            continue;
         }

         last_message = message;
         break;
      }

      if (last_message) {
         const last_read_date = new Date(last_read_time);
         const last_message_date = new Date(last_message.send_time);

         if (last_message_date > last_read_date) {
            message_notifications.push(dm.id);
         }
      }
   }

   // console.log("notifications", notifications);

   return {
      args,
      user,
      friend_requests_sent,
      friend_requests: filtered_friend_requests,
      dms: filtered_dms,
      blocklist: blocklist,
      notifications,
      message_notifications,
   };
}