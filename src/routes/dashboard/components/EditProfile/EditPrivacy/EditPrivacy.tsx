import React, { useState } from 'react'
import { useMutation } from 'apollo/apollo';
import { useGetProfileQuery } from 'apollo/hooks/useGetProfileQuery'
import { UPDATE_PROFILE_MUTATION } from 'apollo/mutation/update_profile';
import { InputValueType } from 'types/InputValueType'
import { profile_privacy_options, DEFAULT_PROFILE_VISIBILITY } from '@tscity/shared/profile_visibility'

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import EditRow from 'components/EditRow/EditRow'
import { useUpdateEffect } from 'hooks/useUpdateEffect'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/styles';


const EditPrivacyFormControlLabel = withStyles({
   root: {
      alignItems: 'flex-start',
   },
   label: {
      paddingTop: '9px'
   }
})(FormControlLabel)

export default function EditPrivacy(props) {
   const [args, profile] = useGetProfileQuery();
   const initial_radio_group_value: InputValueType = {
      value: (profile && profile.visibility) || DEFAULT_PROFILE_VISIBILITY
   }
   const [radio_group, setRadioGroup] = useState(initial_radio_group_value)
   const [updateProfile, update_profile_result] = useMutation(UPDATE_PROFILE_MUTATION)


   // Set value when profile loads
   useUpdateEffect(
      () => {
         setRadioGroup(old_radio_group => {
            if (profile && profile.visibility && profile.visibility !== old_radio_group.value) {
               return {
                  ...old_radio_group,
                  value: profile.visibility
               }
            }

            return old_radio_group
         })
      },
      [profile]
   )

   const handleChange = event => {
      setRadioGroup({
         value: event.target.value
      })
   }

   const onPrivacySave = () => {
      const options = {
         variables: {
            body: {
               visibility: radio_group.value
            }
         }
      }

      updateProfile(options)
   }

   const saved_option = profile_privacy_options[(profile || {}).visibility || DEFAULT_PROFILE_VISIBILITY]

   return (
      <EditRow
         label={"Who can see my profile?"}
         is_loading={args.loading}
         // onCancel={onCancel}
         main_content={saved_option? `${saved_option.label} - ${saved_option.description}` : ''}
         extra_content={
            <React.Fragment>
               <div className="edit_email__extra_row_paragraph">
                  {`Choose who can see the information on your profile.`}
               </div>
               <RadioGroup aria-label="gender" name="gender1" value={radio_group.value} onChange={handleChange}>
                  {Object.keys(profile_privacy_options).map(key => {
                     const option = profile_privacy_options[key];
                     return (
                        <EditPrivacyFormControlLabel
                           key={key}
                           value={option.id}
                           control={<Radio />}
                           label={
                              <React.Fragment>
                                 <span>{option.label}</span>
                                 <br />
                                 <span style={{ fontSize: '14px', lineHeight: 'normal' }}>{option.description}</span>
                              </React.Fragment>
                           }
                        />
                     )
                  })}
               </RadioGroup>
               <Button
                  variant="contained"
                  color="secondary"
                  onClick={onPrivacySave}
                  disabled={update_profile_result.loading}
               >
                  {'Save'}
               </Button>
               <div className="edit_email__extra_row_help_text">
                  {radio_group.status === 'error'? radio_group.message : '' }
               </div>
            </React.Fragment>
         }
      />
   )
}
