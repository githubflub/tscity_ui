import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'hocs/withRouter'
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

import TSCard from 'components/TSCard'
import TSCardHeader from 'components/TSCard/components/TSCardHeader'
// import TSCardContentLight from 'components/TSCard/components/TSCardContentLight'
import TSCardContentVeryLight from 'components/TSCard/components/TSCardContentVeryLight';
import MaterialInput from 'components/MaterialInput';
import { useUpdateEffect } from 'hooks/useUpdateEffect';
import { teenspotForgotPasswordSubmit } from 'redux_store/modules/session';


function ResetPassword(props) {
   const {
      teenspotForgotPasswordSubmit,
      forgot_password_submit_ing,
      forgot_password_submit_error,
      location,
   } = props
   const { query } = location;

   const [new_password, setNewPassword] = useState({ value: '' })
   const [username, setUsername] = useState({ value: query.username || '' })
   const [confirm_new_password, setConfirmNewPassword] = useState({ value: '' })
   const [verification_code, setVerificationCode] = useState({ value: query.verification_code || '' })
   const [reset_password_form, setResetPasswordForm] = useState({})

   const can_submit_password = !!(
      verification_code.value
      && new_password.value
      && confirm_new_password.value
      && confirm_new_password.status !== 'error'
   )

   useEffect(
      () => {
         if (new_password.visited && confirm_new_password.visited) {
            if (new_password.value !== confirm_new_password.value) {
               setConfirmNewPassword({
                  ...confirm_new_password,
                  status: 'error',
                  message: 'Passwords don\'t match!',
               })
            }
            else {
               setConfirmNewPassword({
                  value: confirm_new_password.value,
                  visited: confirm_new_password.visited,
               })
            }
         }
      },
      [
         new_password.value,
         new_password.visited,
         confirm_new_password.value,
         confirm_new_password.visited,
      ]
   )

   useUpdateEffect(
      () => {
         if (!forgot_password_submit_ing) {
            if (forgot_password_submit_error) {
               setResetPasswordForm({
                  ...reset_password_form,
                  status: 'error',
                  message: forgot_password_submit_error.message || 'Unknown error'
               })
            }
            else {
               setResetPasswordForm({
                  ...reset_password_form,
                  status: 'success',
                  message: 'Password successfully reset. Click here to go to login page!'
               })
            }
         }
      },
      [forgot_password_submit_ing]
   )

   const onForgotPasswordSubmitClick = () => {
      teenspotForgotPasswordSubmit(
         username.value,
         verification_code.value,
         new_password.value,
      )
   }

   return (
      <div className="teenspot_app_layout__page">
         <div className="teenspot_app_layout__page_container">
            <TSCard>
               <TSCardHeader>Reset Password</TSCardHeader>
               {reset_password_form.status === 'success'?
                     <TSCardContentVeryLight>
                        Password successfully reset! <Link to={{
                           pathname: "/",
                           search: username.value? `?username=${username.value}` : '',
                        }}>Login?</Link>
                     </TSCardContentVeryLight>
                  :  <TSCardContentVeryLight>
                        Enter your verification code and your new password!

                        <div className="ts_material_form__form_help_text">
                           {reset_password_form.status === 'error'? reset_password_form.message : ''}
                        </div>

                        <form>
                           <div className="ts_material_form__row">
                              <MaterialInput
                                 id="reset_password__username"
                                 label="Username"
                                 // shrink={true}
                                 value={username.value || ''}
                                 onChange={event => setUsername({ value: event.target.value })}
                                 input_props={{
                                    autoComplete: 'username'
                                 }}
                                 status={username.status}
                                 help={username.message || ''}
                              />
                           </div>

                           <div className="ts_material_form__row" style={{ display: 'none' }}>
                              <MaterialInput
                                 id="reset_password__current_password"
                                 label="Current Password"
                                 // shrink={true}
                                 // value={current_password_value.value || ''}
                                 // onChange={event => setCurrentPasswordValue({ value: event.target.value })}
                                 input_props={{
                                    autoComplete: 'current-password'
                                 }}
                                 type="password"
                              />
                           </div>

                           <div className="ts_material_form__row">
                              <MaterialInput
                                 id="reset_password__new_password"
                                 label="New Password"
                                 // shrink={true}
                                 // color="red"
                                 value={new_password.value || ''}
                                 onChange={event => setNewPassword({ value: event.target.value, visited: true })}
                                 input_props={{
                                    onFocus: event => setNewPassword({ ...new_password, visited: true }),
                                    autoComplete: 'new-password'
                                 }}
                                 type="password"
                              />
                           </div>

                           <div className="ts_material_form__row">
                              <MaterialInput
                                 id="reset_password__confirm_new_password"
                                 label="Confirm New Password"
                                 // shrink={true}
                                 // color="red"
                                 value={confirm_new_password.value || ''}
                                 onChange={event => setConfirmNewPassword({ ...confirm_new_password, value: event.target.value })}
                                 input_props={{
                                    onFocus: event => setConfirmNewPassword({ ...confirm_new_password, visited: true }),
                                    autoComplete: 'new-password'
                                 }}
                                 status={confirm_new_password.status}
                                 help={confirm_new_password.status === 'error'? confirm_new_password.message : null}
                                 type="password"
                              />
                           </div>

                           <div className="ts_material_form__row">
                              <MaterialInput
                                 id="reset_password__verification_code_input"
                                 label="Verification Code"
                                 // color="red"
                                 value={verification_code.value || ''}
                                 onChange={event => setVerificationCode({ value: event.target.value })}
                                 type="number"
                              />
                           </div>

                           <div className="ts_material_form__row">
                              <Button
                                 variant="contained"
                                 color="primary"
                                 onClick={onForgotPasswordSubmitClick}
                                 disabled={!can_submit_password}
                              >
                                 Reset Password
                              </Button>
                           </div>

                        </form>

                        <div className="ts_material_form__row">
                           <Link
                              to={{
                                 pathname: "/forgot_password",
                                 search: username.value? `?username=${username.value}` : '',
                              }}
                           >
                              Need a verification code?
                           </Link>
                        </div>

                     </TSCardContentVeryLight>
               }

            </TSCard>
         </div>
      </div>
   )
}

export default connect(
   state => ({
      ...state.session,
   }),
   dispatch => ({
      teenspotForgotPasswordSubmit: bindActionCreators(teenspotForgotPasswordSubmit, dispatch),
   })
)(ResetPassword)