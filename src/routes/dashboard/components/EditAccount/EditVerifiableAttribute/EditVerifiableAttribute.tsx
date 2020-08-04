import React, { useState } from 'react'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import { useUpdateEffect } from 'hooks/useUpdateEffect'
import MaterialInput from 'components/MaterialInput'
import Button from '@material-ui/core/Button'
import {
   VERIFICATION_CODE_LENGTH,
   canSendVerificationCode,
   canUpdateUserAttribute,
} from 'redux_store/modules/session'
import { InputValueType } from 'types/InputValueType'
import { FormStateType } from 'types/FormStateType'

import '../EditEmail/EditEmail.scss'

export default function EditVerifiableAttribute(props) {
   const [verification_active, setVerificationActive] = useState(false) // useState(default value)
   const [verification_code, setVerificationCode] = useState({ value: '' } as InputValueType)
   const [verification_form, setVerificationForm] = useState({} as FormStateType)

   const [user_attribute_active, setUserAttributeActive] = useState(false)
   const [user_attribute, setUserAttribute] = useState({ value: '' } as InputValueType)
   const [user_attribute_form, setUserAttributeForm] = useState({} as FormStateType)

   const {
      input_type,
      attribute_name_caps, // Phone Number or Email
      attribute_name, // phone number or email
      user_attribute_type, // phone or email
      user_attribute_variable,
      user_attribute_verified_variable,
      previous_user_attribute_update_time,
      previous_user_attribute_verification_code_send_time,
      teenspotSendVerificationCode,
      teenspotConfirmVerificationCode,
      teenspotUpdateUserAttribute,
      verification_code_send_ing,
      verification_code_send_error,
      verification_code_confirm_ing,
      verification_code_confirm_error,
      user_attribute_update_ing,
      user_attribute_update_error,
   } = props

   const { args, user } = useGetSelfQuery();

   useUpdateEffect(
      () => {
         if (!verification_code_send_ing) {
            if (verification_code_send_error) {
               setVerificationForm({
                  status: 'error',
                  message: verification_code_send_error.message || 'Unknown Error'
               })
            }
            else {
               console.log("Sending verification code was success")
            }
         }
      },
      [verification_code_send_ing]
   )

   // On successful verification code confirmation
   useUpdateEffect(
      () => {
         if (!verification_code_confirm_ing) {
            if (verification_code_confirm_error) {
               setVerificationCode({
                  ...verification_code,
                  status: 'error',
                  message: verification_code_confirm_error.message || 'Unknown Error'
               })
            }
            else {
               // Clear error messages
               setVerificationForm({})
               setVerificationCode({
                  value: verification_code.value,
                  status: 'success',
                  message: <span>{'Thank you! Your email has been verified. '}<a onClick={onCancelVerification}>Close</a>.</span>
               })
            }
         }
      },
      [verification_code_confirm_ing]
   )

   useUpdateEffect(
      () => {
         if (!user_attribute_update_ing) {
            if (user_attribute_update_error) {
               setUserAttribute({
                  ...user_attribute,
                  status: 'error',
                  message: user_attribute_update_error.message || 'Unknown Error'
               })
            }
            else {
               // Clear error messages
               onCancelUserAttributeChange()

               // In case they're changing their email over and over again
               // this will make things less confusing.
               setUserAttribute({ value: '' })
               setVerificationCode({ value: '' })

               // Verification code is automatically sent by cognito when
               // email is updated, so we only have to setVerificationActive
               // here.
               setVerificationActive(true)
            }
         }
      },
      [user_attribute_update_ing]
   )

   const onCancelVerification = () => {
      setVerificationActive(false)
      setVerificationForm({})
      setVerificationCode({
         value: verification_code.value
      })
   }

   const onCancelUserAttributeChange = () => {
      setUserAttributeForm({})
      setUserAttribute({ value: user_attribute.value })
      setUserAttributeActive(false)
   }

   const onCancel = () => {
      onCancelUserAttributeChange()
      onCancelVerification()
   }

   const onUserAttributeChangeClick = () => {
      const result = canUpdateUserAttribute(previous_user_attribute_update_time, user_attribute_type)
      if (!result.can_update) {
         setUserAttributeForm({
            status: 'error',
            message: `Please wait ${result.time_remaining} before changing your ${attribute_name} again!`
         })
      }

      setUserAttributeActive(true)
   }

   const sendVerificationCode = () => {
      const result = canSendVerificationCode(previous_user_attribute_verification_code_send_time, user_attribute_type)
      if (result.can_send) {
         // Send code.
         teenspotSendVerificationCode()
      }
      else {
         setVerificationForm({
            status: 'error',
            message: `Please wait ${result.time_remaining} before trying to resend code.`
         })
      }
   }

   const onVerificationCodeSubmit = () => {
      const value = verification_code.value
      if (value.length < VERIFICATION_CODE_LENGTH) {
         setVerificationCode({
            ...verification_code,
            status: 'error',
            message: 'That code ain\'t long enough, buddy!'
         })
         return
      }

      teenspotConfirmVerificationCode(value)
   }

   const onVerifyClick = () => {
      sendVerificationCode()
      setVerificationActive(true)
   }

   const onChangeUserAttributeSubmit = () => {
      let value = user_attribute.value;

      if (user_attribute_type === 'phone') {
         value = '+' + user_attribute.value.replace(/\D/g, '')
      }

      teenspotUpdateUserAttribute({
         [user_attribute_variable]: value
      })
   }

   const user_is_loading = args.loading;
   const has_attribute = !!user[user_attribute_variable]


   return (
      <div className="edit_email">
         <label className="edit_email__label">{attribute_name_caps || ''}</label>
         <div className="edit_email__input_row">
            <div className="edit_email__input_row__left">
               {user_is_loading? <div>loading...</div> :
                  <React.Fragment>
                     <div className="edit_emai__email_display">{has_attribute? user[user_attribute_variable] : `No ${attribute_name_caps}`}</div>
                     <div className="edit_email__verification_status">
                        {has_attribute? (user[user_attribute_verified_variable]? 'Verified' : 'Unverified') : '' }
                     </div>
                  </React.Fragment>
               }
            </div>
            <div className="edit_email__input_row__right">
               {user_is_loading? <React.Fragment></React.Fragment> :
                  verification_active || user_attribute_active?
                     <React.Fragment>
                        <a onClick={onCancel}>Cancel</a>
                     </React.Fragment>
                  :  <React.Fragment>
                        <a onClick={onUserAttributeChangeClick}>{has_attribute? 'Change' : 'Add'}</a>
                        {has_attribute && !user[user_attribute_verified_variable] && <a onClick={onVerifyClick}>Verify</a>}
                     </React.Fragment>
               }
            </div>
         </div>

         {verification_active &&
            <div className="edit_email__extra_row">
               { verification_code.status !== 'success' && <div className="edit_email__extra_row_paragraph">
                  {'We have sent you a code. Enter it below! Haven\'t received it yet? '}
                  <a onClick={sendVerificationCode}>Resend code</a>.
               </div>}
               <div className="edit_email__extra_row_help_text">
                  {verification_form.status === 'error'? verification_form.message : ''}
               </div>
               <div className="edit_email__verification_input_row">
                  { verification_code.status === 'success'?
                        verification_code.message
                     :  <React.Fragment>
                           <div className="edit_email__verification_input">
                              <MaterialInput
                                 id="component_simple"
                                 label="Verification Code"
                                 color="red"
                                 value={verification_code.value || ''}
                                 onChange={event => setVerificationCode({ value: event.target.value })}
                                 type="number"
                              />
                           </div>
                           <Button
                              variant="contained"
                              color="secondary"
                              onClick={onVerificationCodeSubmit}
                              disabled={verification_code.value.length < VERIFICATION_CODE_LENGTH}
                           >
                              Submit
                           </Button>
                        </React.Fragment>
                  }

               </div>
               <div className="edit_email__extra_row_help_text">
                  {verification_code.status === 'error'? verification_code.message : '' }
               </div>
            </div>
         }

         {user_attribute_active &&
            <div className="edit_email__extra_row">
               <div className="edit_email__extra_row_paragraph">
                  {`Enter your new ${attribute_name} below.`}
               </div>
               <div className="edit_email__extra_row_help_text">
                  {user_attribute_form.status === 'error'? user_attribute_form.message : ''}
               </div>
               <MaterialInput
                  id="component_simple"
                  label={`New ${attribute_name_caps}`}
                  color="red"
                  value={user_attribute.value || ''}
                  onChange={event => setUserAttribute({ value: event.target.value })}
                  mask={user_attribute_type === 'phone'? 'phone' : undefined}
                  type={input_type}
                  input_props={{
                     autoComplete: 'off',
                  }}
               />
               <Button
                  variant="contained"
                  color="secondary"
                  onClick={onChangeUserAttributeSubmit}
                  disabled={
                     user_attribute_type === 'phone'?
                        user_attribute.value.replace(/\D/g, '').length !== 11
                     :  user_attribute.value.length < 3
                  }
               >
                  {has_attribute? 'Update' : 'Add'}
               </Button>
               <div className="edit_email__extra_row_help_text">
                  {user_attribute.status === 'error'? user_attribute.message : '' }
               </div>
            </div>
         }

      </div>
   )

}
