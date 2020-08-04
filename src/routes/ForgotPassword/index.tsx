import React, { useState } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

import TSCard from 'components/TSCard'
import TSCardHeader from 'components/TSCard/components/TSCardHeader'
// import TSCardContentLight from 'components/TSCard/components/TSCardContentLight'
import TSCardContentVeryLight from 'components/TSCard/components/TSCardContentVeryLight';
import MaterialInput from 'components/MaterialInput';
import { useUpdateEffect } from 'hooks/useUpdateEffect';
import { teenspotForgotPassword } from 'redux_store/modules/session';


function ForgotPassword(props) {
   const {
      teenspotForgotPassword,
      forgot_password_reset_ing,
      forgot_password_reset_error,
      location,
   } = props
   const { query } = location;

   const [username_value, setUsernameValue] = useState({ value: query.username || '' })
   const [forgot_password_form, setForgotPasswordForm] = useState({})

   useUpdateEffect(
      () => {
         if (!forgot_password_reset_ing) {
            if (forgot_password_reset_error) {
               setUsernameValue({
                  ...username_value,
                  status: 'error',
                  message: forgot_password_reset_error.message || 'Unknown error'
               })
            }
            else {
               setForgotPasswordForm({
                  ...forgot_password_form,
                  status: 'success',
                  message: '',
               })
            }
         }
      },
      [forgot_password_reset_ing]
   )

   const onForgotPasswordClick = () => {
      teenspotForgotPassword(username_value.value)
   }

   const HaveAVerificationCode = (
      <div className="ts_material_form__row">
         <Link to={{
            pathname: "/reset_password",
            search: username_value.value? `?username=${username_value.value}` : '',
         }}>Have a verification code?</Link>
      </div>
   )

   return (
      <div className="teenspot_app_layout__page">
         <div className="teenspot_app_layout__page_container">
            <TSCard>
               <TSCardHeader>Reset Password</TSCardHeader>
               { forgot_password_form.status === 'success'?
                     <TSCardContentVeryLight>
                        An email with a verification code and link to reset your password has been sent!
                        <br/>
                        <br/>
                        {HaveAVerificationCode}
                     </TSCardContentVeryLight>
                  :  <TSCardContentVeryLight>
                        Enter the username or email of your account below to reset its password.

                        <div className="ts_material_form__form_help_text">
                           {forgot_password_form.status === 'error'? forgot_password_form.message : ''}
                        </div>

                        <form>
                           <div className="ts_material_form__row">
                              <div className="edit_email__verification_input">
                                 <MaterialInput
                                    id="change_password__username"
                                    label="Username"
                                    // shrink={true}
                                    value={username_value.value || ''}
                                    onChange={event => setUsernameValue({ value: event.target.value })}
                                    input_props={{
                                       autoComplete: 'username'
                                    }}
                                    status={username_value.status}
                                    help={username_value.message || ''}
                                 />
                              </div>
                           </div>

                           <div className="ts_material_form__row" style={{ display: 'none' }}>
                              <div className="edit_email__verification_input">
                                 <MaterialInput
                                    id="change_password_username__current_password"
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
                           </div>

                           <div className="ts_material_form__row">
                              <Button
                                 variant="contained"
                                 color="primary"
                                 onClick={onForgotPasswordClick}
                                 disabled={!username_value.value}
                              >
                                 Reset Password
                              </Button>
                           </div>

                        </form>

                        {HaveAVerificationCode}

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
      teenspotForgotPassword: bindActionCreators(teenspotForgotPassword, dispatch),
   })
)(ForgotPassword)