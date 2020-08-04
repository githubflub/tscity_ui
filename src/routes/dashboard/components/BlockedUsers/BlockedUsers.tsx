import React from 'react'
import EditRowsWithMobile from '../EditRowsWithMobile/EditRowsWithMobile'
import Button from '@material-ui/core/Button'
import { useBlockedUsers } from 'hooks/BlockedUsers/useBlockedUsers'

export default function BlockedUsers(props) {
   const {
      loading,
      blocked_users,
      openUnblockUserDialog,
      BlockedUsersDialog,
   } = useBlockedUsers({ skip_query: false }); // Don't skip query.

   const rows: React.ReactNode[] = blocked_users
      .map(user => (
         <div>
            <span>{user.display_name || user.username}</span>
            <Button
               variant="contained"
               color="secondary"
               onClick={() => openUnblockUserDialog(user)}
            >
               {`Unblock`}
            </Button>
         </div>
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