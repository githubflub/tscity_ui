import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
   teenspotSendEmailVerificationCode,
   teenspotConfirmEmailVerificationCode,
   teenspotUpdateUserEmail,
} from 'redux_store/modules/session'

import EditVerifiableAttribute from '../EditVerifiableAttribute/EditVerifiableAttribute';


function EditEmail(props) {
   const {
      previous_email_verification_code_send_time,
      teenspotSendEmailVerificationCode,
      teenspotConfirmEmailVerificationCode,
      teenspotUpdateUserEmail,
      email_verification_code_send_ing,
      email_verification_code_send_error,
      email_verification_code_confirm_ing,
      email_verification_code_confirm_error,
      previous_email_update_time,
      user_email_update_ing,
      user_email_update_error,
   } = props;

   return (
      <EditVerifiableAttribute
         attribute_name_caps="Email"
         attribute_name="email"
         user_attribute_type="email"
         user_attribute_variable="email"
         user_attribute_verified_variable="email_verified"
         previous_user_attribute_update_time={previous_email_update_time}
         previous_user_attribute_verification_code_send_time={previous_email_verification_code_send_time}
         teenspotSendVerificationCode={teenspotSendEmailVerificationCode}
         teenspotConfirmVerificationCode={teenspotConfirmEmailVerificationCode}
         teenspotUpdateUserAttribute={teenspotUpdateUserEmail}
         verification_code_send_ing={email_verification_code_send_ing}
         verification_code_send_error={email_verification_code_send_error}
         verification_code_confirm_ing={email_verification_code_confirm_ing}
         verification_code_confirm_error={email_verification_code_confirm_error}
         user_attribute_update_ing={user_email_update_ing}
         user_attribute_update_error={user_email_update_error}
      />
   )
}

export default connect(
   state => ({
      ...state.session
   }),
   dispatch => ({
      teenspotSendEmailVerificationCode: bindActionCreators(teenspotSendEmailVerificationCode, dispatch),
      teenspotConfirmEmailVerificationCode: bindActionCreators(teenspotConfirmEmailVerificationCode, dispatch),
      teenspotUpdateUserEmail: bindActionCreators(teenspotUpdateUserEmail, dispatch),
   })
)(EditEmail)