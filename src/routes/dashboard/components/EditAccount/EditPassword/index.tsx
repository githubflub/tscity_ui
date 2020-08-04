import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MaterialInput from 'components/MaterialInput'
import Button from '@material-ui/core/Button'
import { teenspotChangePassword } from 'redux_store/modules/session'
import { useUpdateEffect } from 'hooks/useUpdateEffect';

import '../EditEmail/EditEmail.scss'

function EditPassword(props) {
   const [password_active, setPasswordActive] = useState(false)
   const [password_form, setPasswordForm] = useState({})
   const [current_password_value, setCurrentPasswordValue] = useState({ value: '' })
   const [new_password_value, setNewPasswordValue] = useState({ value: '' })
   const [confirm_new_password_value, setConfirmNewPasswordValue] = useState({ value: '' })

   const {
      teenspotChangePassword,
      password_change_ing,
      password_change_error,
      identity,
   } = props

   const can_submit_new_password = !!(
      current_password_value.value
      && new_password_value.value
      && confirm_new_password_value.value
      && confirm_new_password_value.status !== 'error'
   )

   useEffect(
      () => {
         // console.log('new_pass', new_password_value.value,
         // new_password_value.visited,
         // confirm_new_password_value.value,
         // confirm_new_password_value.visited,)
         if (new_password_value.visited && confirm_new_password_value.visited) {
            if (new_password_value.value !== confirm_new_password_value.value) {
               setConfirmNewPasswordValue({
                  ...confirm_new_password_value,
                  status: 'error',
                  message: 'Passwords don\'t match!',
               })
            }
            else {
               setConfirmNewPasswordValue({
                  value: confirm_new_password_value.value,
                  visited: confirm_new_password_value.visited,
               })
            }
         }
      },
      [
         new_password_value.value,
         new_password_value.visited,
         confirm_new_password_value.value,
         confirm_new_password_value.visited,
      ]
   )

   // On successful password change
   useUpdateEffect(
      () => {
         if (!password_change_ing) {
            if (password_change_error) {
               setPasswordForm({
                  ...password_form,
                  status: 'error',
                  message: password_change_error.message || 'Failed. Try again later?'
               })
            }
            else {
               setPasswordForm({
                  ...password_form,
                  status: 'success',
               })

               setCurrentPasswordValue({ value: '' })
               setNewPasswordValue({ value: '' })
               setConfirmNewPasswordValue({ value: '' })
            }
         }
      },
      [password_change_ing]
   )

   const onCancelPasswordChange = () => {
      setPasswordActive(false);
      setPasswordForm({})
      setCurrentPasswordValue({ value: current_password_value.value })
      setNewPasswordValue({ value: new_password_value.value })
      setConfirmNewPasswordValue({ value: confirm_new_password_value.value })
   }

   const onCancel = () => {
      onCancelPasswordChange()
   }

   const onPasswordChangeClick = () => {
      setPasswordActive(true)
   }

   const onPasswordChangeSubmit = () => {
      teenspotChangePassword(
         current_password_value.value,
         new_password_value.value,
         confirm_new_password_value.value
      )
   }

   return (
      <div className="edit_email">
         <label className="edit_email__label">Password</label>

         <div className="edit_email__input_row">
            <div className="edit_email__input_row__left">
               {`●●●●●●●●●●●●●●●●`}
            </div>
            <div className="edit_email__input_row__right">
               {password_active?
                     <React.Fragment>
                        <a onClick={onCancel}>Cancel</a>
                     </React.Fragment>
                  :  <React.Fragment>
                        <a onClick={onPasswordChangeClick}>{'Change'}</a>
                     </React.Fragment>
               }
            </div>
         </div>

         {password_active &&
            <div className="edit_email__extra_row">
               {password_form.status !== 'success' &&
                  <div className="edit_email__extra_row_paragraph">
                     {'Confirm your current password and enter your new password!'}
                  </div>
               }

               <div className="edit_email__extra_row_help_text">
                  {password_form.status === 'error'? password_form.message : ''}
               </div>

               {password_form.status === 'success'?
                     <div className="edit_email__verification_input_row">
                        {`Password successfully changed. Use it for your next login!`}
                        &nbsp;
                        <a onClick={onCancel}>Close</a>.
                     </div>
                  :  <form>
                        <div className="ts_material_form__row" style={{ display: 'none' }}>
                           <div className="edit_email__verification_input">
                              <MaterialInput
                                 id="change_password__username"
                                 label="Username"
                                 // shrink={true}
                                 color="red"
                                 value={identity['cognito:username']}
                                 input_props={{
                                    autoComplete: 'username'
                                 }}
                              />
                           </div>
                        </div>

                        <div className="ts_material_form__row">
                           <div className="edit_email__verification_input">
                              <MaterialInput
                                 id="change_password_username__current_password"
                                 label="Current Password"
                                 // shrink={true}
                                 color="red"
                                 value={current_password_value.value || ''}
                                 onChange={event => setCurrentPasswordValue({ value: event.target.value })}
                                 input_props={{
                                    autoComplete: 'current-password'
                                 }}
                                 type="password"
                              />
                           </div>
                        </div>

                        <div className="ts_material_form__row">
                           <div className="edit_email__verification_input">
                              <MaterialInput
                                 id="change_password_username__new_password"
                                 label="New Password"
                                 // shrink={true}
                                 color="red"
                                 value={new_password_value.value || ''}
                                 onChange={event => setNewPasswordValue({ value: event.target.value, visited: true })}
                                 input_props={{
                                    onFocus: event => setNewPasswordValue({ ...new_password_value, visited: true }),
                                    autoComplete: 'new-password'
                                 }}
                                 type="password"
                              />
                           </div>
                        </div>

                        <div className="ts_material_form__row">
                           <div className="edit_email__verification_input">
                              <MaterialInput
                                 id="change_password_username__confirm_new_password"
                                 label="Confirm New Password"
                                 // shrink={true}
                                 color="red"
                                 value={confirm_new_password_value.value || ''}
                                 onChange={event => setConfirmNewPasswordValue({ ...confirm_new_password_value, value: event.target.value })}
                                 input_props={{
                                    onFocus: event => setConfirmNewPasswordValue({ ...confirm_new_password_value, visited: true }),
                                    autoComplete: 'new-password'
                                 }}
                                 status={confirm_new_password_value.status}
                                 help={confirm_new_password_value.status === 'error'? confirm_new_password_value.message : null}
                                 type="password"
                              />
                           </div>
                        </div>

                        <div className="ts_material_form__row">
                           <Button
                              variant="contained"
                              color="secondary"
                              onClick={onPasswordChangeSubmit}
                              disabled={!can_submit_new_password}
                           >
                              Change Password
                           </Button>
                        </div>
                     </form>

               }

            </div>
         }
      </div>
   )
}

export default connect(
   state => ({
      ...state.session
   }),
   dispatch => ({
      teenspotChangePassword: bindActionCreators(teenspotChangePassword, dispatch),
   })
)(EditPassword)