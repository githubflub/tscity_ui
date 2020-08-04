import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { GET_MY_FRIENDS_QUERY, GET_MY_FRIENDS_QUERY_TYPE } from 'apollo/query/GET_MY_FRIENDS_QUERY'
import { REMOVE_FRIENDSHIP } from 'apollo/mutation/REMOVE_FRIENDSHIP'
import { useDialog } from 'hooks/useDialog'
import { DataProxy } from 'apollo-cache'

const createUpdater = (function_name: string) => (cache: DataProxy, { data: dumb } ) => {
   // console.log("function_name", function_name)
   // console.log("dumb", dumb);
   const { [function_name]: entity } = dumb;
   const data = cache.readQuery<GET_MY_FRIENDS_QUERY_TYPE>({ query: GET_MY_FRIENDS_QUERY });
   const { getMyFriends } = data;
   // console.log("getMyFriends", getMyFriends);
   // console.log("entity", entity)
   if (entity.length) {
      cache.writeQuery({
         query: GET_MY_FRIENDS_QUERY,
         data: {
            ...data,
            getMyFriends: getMyFriends.filter(stored_entity => !(stored_entity.id === entity[0].id))
         },
      });
   }
}

export function useFriendManager() {
   const {
      show_dialog,
      openDialog,
      closeDialog,
      createDialog,
   } = useDialog()

   const args = useQuery(GET_MY_FRIENDS_QUERY)
   if (args.loading || args.error) {
      args.data = {
         getMyFriends: []
      }
   }

   const friendships = (args.data || {}).getMyFriends
   // console.log("friendships", friendships);

   const [
      removeFriendPrivate,
      remove_friend_result,
   ] = useMutation(REMOVE_FRIENDSHIP, { update: createUpdater('removeFriends') });

   const [selected_friendships, setSelectedFriendships] = useState([]);

   const removeFriend = () => {
      closeRemoveFriendConfirmationDialog();

      const options = {
         variables: {
            friendships: selected_friendships.map(item => ({ id: item.id }))
         }
      }
      removeFriendPrivate(options);
      // console.log("removing friend");
   }

   const openRemoveFriendConfirmationDialog = (friendship) => {
      openDialog();
      setSelectedFriendships([ ...selected_friendships, friendship ])
   }

   const closeRemoveFriendConfirmationDialog = () => {
      closeDialog();
      setSelectedFriendships([]);
   }

   const selected_friend_username = (
      selected_friendships.length
      && selected_friendships[0].user
      && (
         selected_friendships[0].user.display_name
         || selected_friendships[0].user.username
      )
   ) || 'this person'


   return {
      args_friends: args,
      friendships,

      openRemoveFriendConfirmationDialog,
      closeRemoveFriendConfirmationDialog,
      RemoveFriendConfirmationDialog: createDialog(
         <div>
            <p>{`Remove ${selected_friend_username} as a friend?`}</p>
            <Button
               variant="contained"
               color="primary"
               onClick={removeFriend}
               disabled={!selected_friendships.length}
            >Remove Friend</Button>
            <Button
               variant="contained"
               color="secondary"
               onClick={closeRemoveFriendConfirmationDialog}
            >Cancel</Button>
         </div>
      )
   }
}