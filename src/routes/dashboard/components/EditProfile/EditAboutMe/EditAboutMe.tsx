import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';

import Button from '@material-ui/core/Button';

import { useMutation } from '@apollo/react-hooks'
import { useGetProfileQuery } from 'apollo/hooks/useGetProfileQuery'
import { UPDATE_PROFILE_MUTATION } from 'apollo/mutation/update_profile';

function EditProfile(props) {
   const [about_me, setAboutMe] = useState({ value: '' })
   const [args, profile] = useGetProfileQuery();
   const [updateProfile, result] = useMutation(UPDATE_PROFILE_MUTATION)

   useEffect(
      () => {
         if (!!args.data && args.data.getProfile) {
            setAboutMe({ value: args.data.getProfile.about_me || about_me.value })
         }
      },
      [!!args.data]
   )

   const onSave = event => {
      event.preventDefault()

      let str = about_me.value;

      if (typeof str !== 'string') {
         return;
      }

      str = str.trim();

      updateProfile({
         variables: {
            body: {
               about_me: str,
            }
         }
      })
   }

   return (
      <form autoComplete="off">
         <TextField
            name="about_me"
            id="edit_profile__about_me"
            label="About Me"
            multiline
            variant="filled"
            rows={4}
            rowsMax={9999}
            value={about_me.value}
            onChange={event => setAboutMe({ value: event.target.value })}
            inputProps={{
               maxLength: 300,
            }}
         />

         <Button
            variant="contained"
            color="primary"
            onClick={onSave}
            disabled={result.loading}
         >
            {result.loading? 'Saving...' : 'Save'}
         </Button>
      </form>

   );
}

export default EditProfile;