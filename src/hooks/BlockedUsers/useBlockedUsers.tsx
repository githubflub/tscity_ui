import React, { useState } from 'react'
import { useMutation, useQuery, DataProxy } from 'apollo/apollo'
import { BLOCK_USER } from 'apollo/mutation/BLOCK_USER'
import {
   GET_MY_BLOCKED_USERS,
   GET_MY_BLOCKED_USERS_TYPE
} from 'apollo/query/GET_MY_BLOCKED_USERS'
import { UNBLOCK_USERS } from 'apollo/mutation/UNBLOCK_USERS'
import { useDialog } from 'hooks/useDialog'
import Button from '@material-ui/core/Button'
import { User } from 'lib/schema/user/typedef'
import { GET_SELF_QUERY_TYPE, GET_SELF_QUERY } from 'apollo/query/GET_SELF_QUERY'

export const BlockDialogTypes = {
   unblock: 'unblock',
   block: 'block'
} as const

export type BlockDialogType = typeof BlockDialogTypes[keyof typeof BlockDialogTypes]

const createUpdater = (function_name: string) => (cache: DataProxy, { data: response }) => {
   const { [function_name]: blocked_user } = response;
   const data = cache.readQuery<GET_SELF_QUERY_TYPE>({ query: GET_SELF_QUERY })
   const { getMyBlockList } = data;

   cache.writeQuery({
      query: GET_SELF_QUERY,
      data: {
         ...data,
         getMyBlockList: function_name === 'addBlockedUser'
            ? getMyBlockList
               .filter(id => id !== blocked_user.id)
               .concat(blocked_user.id)
            : function_name === 'unblockUsers'
               ? getMyBlockList.filter(id => !blocked_user.includes(id))
               : getMyBlockList
      }
   })

   try {
      const data2 = cache.readQuery<GET_MY_BLOCKED_USERS_TYPE>({ query: GET_MY_BLOCKED_USERS })
      const { getMyBlockedUsers } = data2;
      cache.writeQuery({
         query: GET_MY_BLOCKED_USERS,
         data: {
            ...data2,
            getMyBlockedUsers: function_name === 'addBlockedUser'
               ? [blocked_user]
                  .concat(data2.getMyBlockedUsers.filter(user => user.id !== blocked_user.id))
               : function_name === 'unblockUsers'
                  ? getMyBlockedUsers
                     .filter(user => !blocked_user.includes(user.id))
                  : getMyBlockedUsers
         }
      })
   }
   catch (error) {
      // User hasn't called this query,
      // so we don't need to update it.
   }

}

export type UseBlockedUsersOptions = {
   skip_query?: boolean;
   contained?: any
}

export function useBlockedUsers(options: UseBlockedUsersOptions = {}) {
   const {
      skip_query = true,
      contained,
   } = options;
   const {
      show_dialog,
      openDialog,
      closeDialog,
      createDialog,
   } = useDialog({ contained })
   const [selected_users, setSelectedUsers] = useState<User[]>([])
   const [dialog_type, setDialogType]
      = useState<BlockDialogType>(BlockDialogTypes.block)

   const query_options = { skip: skip_query }
   const args = useQuery(GET_MY_BLOCKED_USERS, query_options);
   const blocked_users = (args.data || []).getMyBlockedUsers || []

   const [
      blockUserPrivate,
      block_user_result
   ] = useMutation(BLOCK_USER, {
      update: createUpdater('addBlockedUser')
   })

   const [
      unblockUsersPrivate,
      unblock_users_result
   ] = useMutation(UNBLOCK_USERS, {
      update: createUpdater('unblockUsers')
   })

   const blockUser = () => {
      closeDialog();
      if (!selected_users.length) return;

      const options = {
         variables: {
            blocked_user_id: selected_users[0].id
         },
         optimisticResponse: {
            __typename: 'Mutation',
            addBlockedUser: {
               ...selected_users[0],
               __typename: 'User',
            }
         }
      }

      blockUserPrivate(options);
   }

   const unblockUsers = () => {
      closeDialog();
      if (!selected_users.length) return;
      const options = {
         variables: {
            blocked_user_ids: selected_users
               .map(user => user.id)
         }
      }

      unblockUsersPrivate(options);
   }

   const openBlockUserDialog = (user) => {
      openBlockDialog(user, BlockDialogTypes.block)
   }

   const openUnblockUserDialog = (user) => {
      openBlockDialog(user, BlockDialogTypes.unblock)
   }

   const openBlockDialog = (user, dialog_type) => {
      const users: User[] = Array
         .isArray(user)
            ? user
            : [user]

      setDialogType(dialog_type);
      setSelectedUsers(users);
      openDialog();
   }

   const selected_user_name = selected_users.length
      ? (selected_users[0].display_name
         || selected_users[0].username
         || 'this person')
      : 'this person'

   return {
      loading: args.loading,
      blocked_users,
      openBlockUserDialog,
      openUnblockUserDialog,
      BlockedUsersDialog: createDialog(
         <div>
            {dialog_type === BlockDialogTypes.block
               ? <p>{`Block ${selected_user_name}?`}</p>
               : <p>{`Unblock ${selected_user_name}?`}</p>
            }
            {dialog_type === BlockDialogTypes.block
               ? <Button
                     variant="contained"
                     color="primary"
                     onClick={event => {
                        event.stopPropagation();
                        blockUser()
                     }}
                  >Block User</Button>
               : <Button
                     variant="contained"
                     color="primary"
                     onClick={event => {
                        event.stopPropagation();
                        unblockUsers()
                     }}
                  >Unblock User</Button>
            }
            <Button
               variant="contained"
               color="secondary"
               onClick={event => {
                  event.stopPropagation();
                  closeDialog()
               }}
            >Cancel</Button>
         </div>
      )
   }
}