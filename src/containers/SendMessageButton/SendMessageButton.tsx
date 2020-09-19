import React from 'react'
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from 'react-redux';
import { sendOpenConversationRequestThunk } from 'redux_store/modules/messenger/messenger'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'

export function SendMessageButton(props) {
   const { user } = props;
   const dispatch = useDispatch();
   const { is_authenticated } = useSelector(state => state.session);
   const { user: self } = useGetSelfQuery();

   // Can't send a message if you're not logged in.
   if (!is_authenticated) return null;

   // Who are you gonna send this message to???
   if (!user || !user.id || !user.username) return null;

   return (
      <Button
         variant="contained"
         color="primary"
         onClick={() => dispatch(sendOpenConversationRequestThunk({
            target_user_id: user.id,
            target_username: user.username,
            sender_user_id: self.id,
            sender_username: self.username,
            is_open: true,
         }))}
      >
         {'Send Message'}
      </Button>
   );
}