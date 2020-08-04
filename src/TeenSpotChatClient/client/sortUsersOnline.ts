import { getUserPowerLevel } from 'utils/getUserPowerLevel'
import { GET_CHAT_DATA_QUERY } from '../graphql/query/getChatDataQuery'

const power_level_ranking = [
   'webmaster',
   'moderator',
   'user',
]

export function sortUsersOnlineApollo(options, thread_id) {
   const { apollo_client } = options;

   const chat_data = apollo_client.readQuery({ query: GET_CHAT_DATA_QUERY })

   apollo_client.writeQuery({
      query: GET_CHAT_DATA_QUERY,
      data: {
         ...chat_data,
         listRooms: chat_data.listRooms.map((room, i) => {
            if (room.id !== thread_id) {
               return room;
            }

            const updated_room = {
               ...room,
               users_online: sortUsersOnline(room.users_online, thread_id)
            }

            return updated_room;
         })
      }
   })
}

export function sortUsersOnline(users, thread_id) {
   const sorted_users = [ ...users ];

   const sortByPowerLevel = (a, b) => {
      const a_power_level = getUserPowerLevel('thread', thread_id, a);
      const b_power_level = getUserPowerLevel('thread', thread_id, b);

      const a_i = power_level_ranking.indexOf(a_power_level);
      const b_i = power_level_ranking.indexOf(b_power_level);

      if (a_i > b_i) {
         return 1;
      }
      else if (a_i < b_i) {
         return -1;
      }

      // Sort alphabetically.
      return 0;
   }

   sorted_users.sort(sortByPowerLevel);

   return sorted_users
}