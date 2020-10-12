import { useMutation, MutationHookOptions } from 'apollo/apollo'
import { REJECT_FRIEND_REQUEST } from 'apollo/mutation/REJECT_FRIEND_REQUEST'
import { ACCEPT_FRIEND_REQUEST } from 'apollo/mutation/ACCEPT_FRIEND_REQUEST'
import { UNSEND_FRIEND_REQUEST } from 'apollo/mutation/UNSEND_FRIEND_REQUEST'
import { createFriendRequestMutationUpdater } from 'hooks/FriendRequest/createFriendRequestMutationUpdater'

const actionOnFriendRequest = (func: Function, action?: string) => (friend_request_id: number) => {
   // action && console.log(`${action} friend request`)

   const query: MutationHookOptions = {
      variables: {
         friend_request_id
      }
   }

   if (action === 'Rejecting') {
      query.optimisticResponse = {
         __typename: 'Mutation',
         rejectFriendRequest: {
            __typename: 'FriendRequest',
            id: friend_request_id,
         }
      }
   }
   else if (action === 'Accepting') {
      query.optimisticResponse = {
         __typename: 'Mutation',
         acceptFriendRequest: {
            __typename: 'FriendRequest',
            id: friend_request_id,
         }
      }
   }

   func(query);
}

export function useFriendRequests() {

   // Reject Friend Request
   const [
      deleteFriendRequest,
      delete_friend_request_result
   ] = useMutation(REJECT_FRIEND_REQUEST, {
      update: createFriendRequestMutationUpdater('rejectFriendRequest', 'getMyFriendRequests', 'filter')
   });

   // Accept Friend Request
   const [
      acceptFriendRequestPrivate,
      accept_friend_request_result
   ] = useMutation(ACCEPT_FRIEND_REQUEST, {
      update: createFriendRequestMutationUpdater('acceptFriendRequest', 'getMyFriendRequests', 'filter')
   });

   // Unsend Friend Request
   const [
      unsendFriendRequest,
      unsend_friend_request_result
   ] = useMutation(UNSEND_FRIEND_REQUEST, {
      update: createFriendRequestMutationUpdater('unsendFriendRequest', 'getMySentFriendRequests', 'filter')
   })

   // console.log("rejectFriendRequest result", delete_friend_request_result)
   // console.log("acceptFriendRequest result", accept_friend_request_result)
   // console.log("unsendFriendRequest result", unsend_friend_request_result)

   const friend_requests_loading = (
      delete_friend_request_result.loading
      || accept_friend_request_result.loading
      || unsend_friend_request_result.loading
   )

   return {
      rejectFriendRequest: actionOnFriendRequest(deleteFriendRequest, 'Rejecting'),
      acceptFriendRequest: actionOnFriendRequest(acceptFriendRequestPrivate, 'Accepting'),
      unsendFriendRequest: actionOnFriendRequest(unsendFriendRequest, 'Unsending'),
      delete_friend_request_result,
      friend_requests_loading,
   }
}