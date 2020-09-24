import React from 'react'
import EditRowsWithMobile from '../EditRowsWithMobile/EditRowsWithMobile'
import Button from '@material-ui/core/Button'
import { useBlockedUsers } from 'hooks/BlockedUsers/useBlockedUsers'
import UserItem from 'components/UserItem/UserItem'

export default function BlockedUsers(props) {
   const {
      loading,
      blocked_users,
      openUnblockUserDialog,
      BlockedUsersDialog,
   } = useBlockedUsers({ skip_query: false }); // Don't skip query.

   const rows: React.ReactNode[] = blocked_users
      .map(user => (
         <UserItem
            user={user}
            right_side_items={
               <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => openUnblockUserDialog(user)}
               >
                  {`Unblock`}
               </Button>
            }
         />
      ))

   if (!rows.length) {
      rows.push(
         loading
            ? "Loading blocked users..."
            : "No blocked users"
      )
   }

   return (
      <React.Fragment>
         {BlockedUsersDialog}
         <EditRowsWithMobile
            title={`Blocked Users`}
            color="blue"
            rows={rows}
         />
      </React.Fragment>
   )
}