import { GET_MY_FRIENDS_QUERY } from 'apollo/query/GET_MY_FRIENDS_QUERY'
import { GET_SELF_QUERY } from 'apollo/query/GET_SELF_QUERY';

function removeSentFriendRequest(tools, data) {
   const { apollo_client, getState } = tools;

   // Throws an error if query not in cache.
   let get_self;
   try {
      get_self = apollo_client.readQuery({ query: GET_SELF_QUERY });
   }
   catch (error) {
      // Assume query wasn't in the cache.
      // Meaning there's nothing to update.
      return;
   }

   apollo_client.writeQuery({
      query: GET_SELF_QUERY,
      data: {
         ...get_self,
         getMySentFriendRequests: get_self.getMySentFriendRequests.filter(fq => fq.id !== data.friend_request_id),
      }
   })
}

function addUserGroup(tools, data) {
   const { apollo_client, getState } = tools;

   // Throws an error if query not in cache.
   let my_friends;
   try {
      my_friends = apollo_client.readQuery({ query: GET_MY_FRIENDS_QUERY });
   }
   catch (error) {
      // Assume query wasn't in the cache.
      // Meaning there's nothing to update.
      return;
   }

   // Remove duplicates.
   const updated_friends = my_friends.getMyFriends.filter(friend => friend.id !== data.user_group.id)

   // Add new friend.
   updated_friends.unshift({
      ...data.user_group,
      __typename: 'UserGroup',
   });

   apollo_client.writeQuery({
      query: GET_MY_FRIENDS_QUERY,
      data: {
         ...my_friends,
         getMyFriends: updated_friends
      }
   })
}

// data is an array of UserGroup
export function onFriendRequestAccepted(tools, data) {
   addUserGroup(tools, data);
   removeSentFriendRequest(tools, data);
}