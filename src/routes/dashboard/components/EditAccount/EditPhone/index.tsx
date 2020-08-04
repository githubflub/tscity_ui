import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
   teenspotSendPhoneVerificationCode,
   teenspotConfirmPhoneVerificationCode,
   teenspotUpdateUserPhone,
} from 'redux_store/modules/session'

import EditVerifiableAttribute from '../EditVerifiableAttribute/EditVerifiableAttribute';


function EditEmail(props) {
   const {
      previous_phone_verification_code_send_time,
      teenspotSendPhoneVerificationCode,
      teenspotConfirmPhoneVerificationCode,
      teenspotUpdateUserPhone,
      phone_verification_code_send_ing,
      phone_verification_code_send_error,
      phone_verification_code_confirm_ing,
      phone_verification_code_confirm_error,
      previous_phone_update_time,
      user_phone_update_ing,
      user_phone_update_error,
   } = props;

   return (
      <EditVerifiableAttribute
         input_type="tel"
         attribute_name_caps="Phone Number"
         attribute_name="phone number"
         user_attribute_type="phone"
         user_attribute_variable="phone_number"
         user_attribute_verified_variable="phone_verified"
         previous_user_attribute_update_time={previous_phone_update_time}
         previous_user_attribute_verification_code_send_time={previous_phone_verification_code_send_time}
         teenspotSendVerificationCode={teenspotSendPhoneVerificationCode}
         teenspotConfirmVerificationCode={teenspotConfirmPhoneVerificationCode}
         teenspotUpdateUserAttribute={teenspotUpdateUserPhone}
         verification_code_send_ing={phone_verification_code_send_ing}
         verification_code_send_error={phone_verification_code_send_error}
         verification_code_confirm_ing={phone_verification_code_confirm_ing}
         verification_code_confirm_error={phone_verification_code_confirm_error}
         user_attribute_update_ing={user_phone_update_ing}
         user_attribute_update_error={user_phone_update_error}
      />
   )
}

export default connect(
   state => ({
      ...state.session
   }),
   dispatch => ({
      teenspotSendPhoneVerificationCode: bindActionCreators(teenspotSendPhoneVerificationCode, dispatch),
      teenspotConfirmPhoneVerificationCode: bindActionCreators(teenspotConfirmPhoneVerificationCode, dispatch),
      teenspotUpdateUserPhone: bindActionCreators(teenspotUpdateUserPhone, dispatch),
   })
)(EditEmail)