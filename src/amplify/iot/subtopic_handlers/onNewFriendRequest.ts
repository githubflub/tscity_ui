import { GET_SELF_QUERY } from 'apollo/query/GET_SELF_QUERY'

export function onNewFriendRequest(tools, data) {
   const { apollo_client } = tools;

   // Throws an error if query not in cache.
   let self;
   try {
      self = apollo_client.readQuery({ query: GET_SELF_QUERY });
   }
   catch (error) {
      // Assume query wasn't in the cache.
      // Meaning there's nothing to update.
      return;
   }

   // filter out dups.
   const updated_friend_requests = self.getMyFriendRequests.filter(fq => fq.id !== data.id);

   // Add new friend request
   updated_friend_requests.unshift({
      ...data,
      __typename: 'FriendRequest',
   });

   apollo_client.writeQuery({
      query: GET_SELF_QUERY,
      data: {
         ...self,
         getMyFriendRequests: updated_friend_requests,
      }
   })
}