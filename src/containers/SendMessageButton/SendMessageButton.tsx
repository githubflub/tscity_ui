import React from 'react'
import Button from "@material-ui/core/Button";
import { useDispatch, useSelector } from 'react-redux';
import { sendOpenConversationRequestThunk } from 'redux_store/modules/messenger/messenger'

export function SendMessageButton(props) {
   const { user } = props;
   const dispatch = useDispatch();
   const { is_authenticated, identity } = useSelector(state => state.session);

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
            is_open: true,
         }))}
      >
         {'Send Message'}
      </Button>
   );
}