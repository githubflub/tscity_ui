import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks';
import { useSelector } from 'react-redux'
import EditRow from 'components/EditRow/EditRow'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import { useUpdateEffect } from 'hooks/useUpdateEffect'
import MaterialInput from 'components/MaterialInput';
import Button from '@material-ui/core/Button'
import { UPDATE_USER_MUTATION } from 'apollo/mutation/update_user'
import { InputValueType } from 'types/InputValueType'

export default function EditUsernameCapitalization(props) {
   const { args, user } = useGetSelfQuery();
   const [updateUser, update_user_result] = useMutation(UPDATE_USER_MUTATION)
   const default_username_value: InputValueType = { value: user.display_name || user.username || '' }
   const [new_username, setNewUsername] = useState(default_username_value)
   const { identity } = useSelector(state => state.session);

   // Set value when the user loads.
   useUpdateEffect(
      () => {
         setNewUsername(old_username => {
            if (user.display_name && old_username.value !== user.display_name) {
               return {
                  ...old_username,
                  value: user.display_name,
               }
            }

            return old_username;
         })
      },
      [user.display_name]
   )

   // Handle API error?
   useUpdateEffect(
      () => {
         if (update_user_result.error) {
            setNewUsername({
               ...new_username,
               status: 'error',
               message: 'There was an error. Try again later? :S'
            })
         }
      },
      [update_user_result.error]
   )

   const isValidUsername = (cleaned_username) => {
      if (cleaned_username.toLowerCase() === user.username) {
         return true;
      }

      return false;
   }

   const onNewUsernameSave = () => {
      const cleaned_username = new_username.value.trim();

      if (isValidUsername(cleaned_username)) {
         updateUser({
            variables: {
               body: {
                  display_name: cleaned_username,
               }
            }
         })
      }
      else {
         setNewUsername({
            ...new_username,
            status: 'error',
            message: 'You may only change the capitalization of your username.'
         })
      }
   }

   const onCancel = () => {
      setNewUsername(default_username_value)
   }

   return (
      <EditRow
         label={"Username Capitalization"}
         is_loading={args.loading}
         onCancel={onCancel}
         main_content={default_username_value.value}
         extra_content={
            <React.Fragment>
               <div className="edit_email__extra_row_paragraph">
                  {`Edit the capitalization of your username below.`}
               </div>
               <MaterialInput
                  id="component_simple"
                  color="red"
                  value={new_username.value}
                  onChange={event => setNewUsername({ value: event.target.value })}
                  input_props={{
                     autoComplete: 'off'
                  }}
               />
               <Button
                  variant="contained"
                  color="secondary"
                  onClick={onNewUsernameSave}
                  disabled={update_user_result.loading}
               >
                  {'Save'}
               </Button>
               <div className="edit_email__extra_row_help_text">
                  {new_username.status === 'error'? new_username.message : '' }
               </div>
            </React.Fragment>
         }
      />
   )
}