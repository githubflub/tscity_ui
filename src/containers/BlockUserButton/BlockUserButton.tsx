import React from 'react'
import Button from "@material-ui/core/Button";
import { useSelector } from 'react-redux';
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery';
import { useBlockedUsers } from 'hooks/BlockedUsers/useBlockedUsers'

export function BlockUserButton(props) {
   const {
      user,
      contained,
      ...other
   } = props;
   const { is_authenticated } = useSelector(state => state.session);
   const { user: self } = useGetSelfQuery();
   const {
      openBlockUserDialog,
      BlockedUsersDialog,
   } = useBlockedUsers({ contained });

   // Can't block someone if you're not logged in.
   if (!is_authenticated) return null;

   // There's no one to block.
   if (!user || !user.id) return null;

   // Can't block yourself!!
   if (self.id === user.id) return null;

   return (
      <React.Fragment>
         <Button
            variant="contained"
            color="secondary"
            onClick={event => {
               event.stopPropagation();
               openBlockUserDialog(user)
            }}
            {...other}
         >
            {'Block User'}
         </Button>
         {BlockedUsersDialog}
      </React.Fragment>
   );
}