import { CognitoUserSession } from 'amazon-cognito-identity-js'
import { getSession } from 'amplify/getSession';
import { signUp } from 'amplify/signUp'
import { signIn } from 'amplify/signIn'
import { signOut } from 'amplify/signOut'
import { sendVerificationCode } from 'amplify/sendVerificationCode'
import { confirmVerificationCode } from 'amplify/confirmVerificationCode'
import { refreshSessionToken } from 'amplify/refreshSessionToken'
import { updateUserAttributes } from 'amplify/updateUserAttributes';
import { changePassword } from 'amplify/changePassword'
import { UPDATE_USER_MUTATION } from 'apollo/mutation/update_user'

import { composeInitialCRUDState } from 'redux_store/utils/composeInitialCRUDState'
import { handleCRUDAction } from 'redux_store/utils/handleCRUDAction'
import { sleep } from 'utils/sleep'
import { confirmSignUp } from 'amplify/confirmSignUp';
import { parseCognitoUser, parseCognitoSession } from 'amplify/parseCognitoUser'
import { getIdTokenFromCognitoUser, getIdTokenFromSession } from 'amplify/getIdToken'
import { forgotPassword } from 'amplify/forgotPassword';
import { forgotPasswordSubmit } from 'amplify/forgotPasswordSubmit';

export const VERIFICATION_CODE_LENGTH = 6;
const SEND_VERIFICATION_CODE_TIME_INTERVAL = 100000 // 100 seconds
const UPDATE_USER_ATTRIBUTE_TIME_INTERVAL = 100000 // 100 seconds

const entity = 'sign'
const SESSION_TOKEN_ENTITY = 'session_token'
const USER_ATTRIBUTES_ENTITY = 'user_attributes'
const USER_EMAIL_ENTITY = 'user_email'
const USER_PHONE_ENTITY = 'user_phone'
const PASSWORD_ENTITY  = 'password'
const FORGOT_PASSWORD_ENTITY  = 'forgot_password'
const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS'
const SIGN_UP_CALL = 'SIGN_UP_CALL'
const SIGN_UP_PASS = 'SIGN_UP_PASS'
const SIGN_UP_FAIL = 'SIGN_UP_FAIL'
const SIGN_IN_CALL = 'SIGN_IN_CALL'
const SIGN_IN_PASS = 'SIGN_IN_PASS'
const SIGN_IN_FAIL = 'SIGN_IN_FAIL'
const SIGN_OUT_CALL = 'SIGN_OUT_CALL'
const SIGN_OUT_PASS = 'SIGN_OUT_PASS'
const SIGN_OUT_FAIL = 'SIGN_OUT_FAIL'
const SIGN_UP_CONFIRM_CALL = 'SIGN_UP_CONFIRM_CALL'
const SIGN_UP_CONFIRM_PASS = 'SIGN_UP_CONFIRM_PASS'
const SIGN_UP_CONFIRM_FAIL = 'SIGN_UP_CONFIRM_FAIL'
const SEND_VERIFICATION_CODE_CALL = 'SEND_VERIFICATION_CODE_CALL'
const SEND_VERIFICATION_CODE_PASS = 'SEND_VERIFICATION_CODE_PASS'
const SEND_VERIFICATION_CODE_FAIL = 'SEND_VERIFICATION_CODE_FAIL'
const CONFIRM_VERIFICATION_CODE_CALL = 'CONFIRM_VERIFICATION_CODE_CALL'
const CONFIRM_VERIFICATION_CODE_PASS = 'CONFIRM_VERIFICATION_CODE_PASS'
const CONFIRM_VERIFICATION_CODE_FAIL = 'CONFIRM_VERIFICATION_CODE_FAIL'
const REFRESH_SESSION_TOKEN_CALL = 'REFRESH_SESSION_TOKEN_CALL'
const REFRESH_SESSION_TOKEN_PASS = 'REFRESH_SESSION_TOKEN_PASS'
const REFRESH_SESSION_TOKEN_FAIL = 'REFRESH_SESSION_TOKEN_FAIL'
const UPDATE_USER_ATTRIBUTES_CALL = 'UPDATE_USER_ATTRIBUTES_CALL'
const UPDATE_USER_ATTRIBUTES_PASS = 'UPDATE_USER_ATTRIBUTES_PASS'
const UPDATE_USER_ATTRIBUTES_FAIL = 'UPDATE_USER_ATTRIBUTES_FAIL'
const CHANGE_PASSWORD_CALL = 'CHANGE_PASSWORD_CALL'
const CHANGE_PASSWORD_PASS = 'CHANGE_PASSWORD_PASS'
const CHANGE_PASSWORD_FAIL = 'CHANGE_PASSWORD_FAIL'
const FORGOT_PASSWORD_CALL = 'FORGOT_PASSWORD_CALL'
const FORGOT_PASSWORD_PASS = 'FORGOT_PASSWORD_PASS'
const FORGOT_PASSWORD_FAIL = 'FORGOT_PASSWORD_FAIL'
const FORGOT_PASSWORD_SUBMIT_CALL = 'FORGOT_PASSWORD_SUBMIT_CALL'
const FORGOT_PASSWORD_SUBMIT_PASS = 'FORGOT_PASSWORD_SUBMIT_PASS'
const FORGOT_PASSWORD_SUBMIT_FAIL = 'FORGOT_PASSWORD_SUBMIT_FAIL'

interface LogInSuccessAction {
   type: typeof LOG_IN_SUCCESS;
   result: CognitoUserSession | void;
}

interface SignOutCallAction {
   type: typeof SIGN_OUT_CALL;
}

interface SignOutPassAction {
   type: typeof SIGN_OUT_PASS;
}

interface SignOutFailAction {
   type: typeof SIGN_OUT_FAIL;
   error: any;
}

interface SignUpConfirmCallAction {
   type: typeof SIGN_UP_CONFIRM_CALL;
   user: any;
}

interface SignUpConfirmPassAction {
   type: typeof SIGN_UP_CONFIRM_PASS;
   user: any;
   result: any;
}

interface SignUpConfirmFailAction {
   type: typeof SIGN_UP_CONFIRM_FAIL;
   user: any;
   error: any;
}

interface SignInCallAction {
   type: typeof SIGN_IN_CALL;
}

interface SignInPassAction {
   type: typeof SIGN_IN_PASS;
   user: any;
   result: any;
}

interface SignInFailAction {
   type: typeof SIGN_IN_FAIL;
   error: any;
}

interface SignUpCallAction {
   type: typeof SIGN_UP_CALL;
   user: any;
}

interface SignUpPassAction {
   type: typeof SIGN_UP_PASS;
   user: any;
   result: any;
}

interface SignUpFailAction {
   type: typeof SIGN_UP_FAIL;
   user: any;
   error: any;
}

interface ConfirmVerificationCodeCallAction {
   type: typeof CONFIRM_VERIFICATION_CODE_CALL;
   verification_type: string;
}

interface ConfirmVerificationCodePassAction {
   type: typeof CONFIRM_VERIFICATION_CODE_PASS;
   verification_type: string;
   data: any;
}

interface ConfirmVerificationCodeFailAction {
   type: typeof CONFIRM_VERIFICATION_CODE_FAIL;
   verification_type: string;
   error: any;
}

interface SendVerificationCodeCallAction {
   type: typeof SEND_VERIFICATION_CODE_CALL;
   verification_type: string;
}

interface SendVerificationCodePassAction {
   type: typeof SEND_VERIFICATION_CODE_PASS;
   verification_type: string;
   result: any;
}

interface SendVerificationCodeFailAction {
   type: typeof SEND_VERIFICATION_CODE_FAIL;
   verification_type: string;
   error: any;
}

interface RefreshSessionTokenCallAction {
   type: typeof REFRESH_SESSION_TOKEN_CALL;
}

interface RefreshSessionTokenPassAction {
   type: typeof REFRESH_SESSION_TOKEN_PASS;
   result: any;
}

interface RefreshSessionTokenFailAction {
   type: typeof REFRESH_SESSION_TOKEN_FAIL;
   error: any;
}

interface UpdateUserAttributesCallAction {
   type: typeof UPDATE_USER_ATTRIBUTES_CALL;
   update_type: string;
}

interface UpdateUserAttributesPassAction {
   type: typeof UPDATE_USER_ATTRIBUTES_PASS;
   update_type: string;
   result: any;
}

interface UpdateUserAttributesFailAction {
   type: typeof UPDATE_USER_ATTRIBUTES_FAIL;
   update_type: string;
   error: any;
}

interface ChangePasswordCallAction {
   type: typeof CHANGE_PASSWORD_CALL;
}

interface ChangePasswordPassAction {
   type: typeof CHANGE_PASSWORD_PASS;
   result: any;
}

interface ChangePasswordFailAction {
   type: typeof CHANGE_PASSWORD_FAIL;
   error: any;
}

interface ForgotPasswordCallAction {
   type: typeof FORGOT_PASSWORD_CALL;
}

interface ForgotPasswordPassAction {
   type: typeof FORGOT_PASSWORD_PASS;
   result: any;
}

interface ForgotPasswordFailAction {
   type: typeof FORGOT_PASSWORD_FAIL;
   error: any;
}

interface ForgotPasswordSubmitCallAction {
   type: typeof FORGOT_PASSWORD_SUBMIT_CALL;
}

interface ForgotPasswordSubmitPassAction {
   type: typeof FORGOT_PASSWORD_SUBMIT_PASS;
   result: any;
}

interface ForgotPasswordSubmitFailAction {
   type: typeof FORGOT_PASSWORD_SUBMIT_FAIL;
   error: any;
}

export type SessionActionTypes = (
   LogInSuccessAction

   | SignOutCallAction
   | SignOutPassAction
   | SignOutFailAction

   | ForgotPasswordSubmitCallAction
   | ForgotPasswordSubmitPassAction
   | ForgotPasswordSubmitFailAction

   | ForgotPasswordCallAction
   | ForgotPasswordPassAction
   | ForgotPasswordFailAction

   | ChangePasswordCallAction
   | ChangePasswordPassAction
   | ChangePasswordFailAction

   | UpdateUserAttributesCallAction
   | UpdateUserAttributesPassAction
   | UpdateUserAttributesFailAction

   | RefreshSessionTokenCallAction
   | RefreshSessionTokenPassAction
   | RefreshSessionTokenFailAction

   | SendVerificationCodeCallAction
   | SendVerificationCodePassAction
   | SendVerificationCodeFailAction

   | SignUpConfirmCallAction
   | SignUpConfirmPassAction
   | SignUpConfirmFailAction

   | SignInCallAction
   | SignInPassAction
   | SignInFailAction

   | SignUpCallAction
   | SignUpPassAction
   | SignUpFailAction

   | ConfirmVerificationCodeCallAction
   | ConfirmVerificationCodePassAction
   | ConfirmVerificationCodeFailAction
);

export function setInitialLoginStatus() {
   return async dispatch => {
      const session = await getSession()
      // console.log("session", session)
      dispatch({
         type: LOG_IN_SUCCESS,
         result: (session || {}).result
      })
   }
}

export function teenspotSignOut() {
   return dispatch => {
      dispatch({
         type: SIGN_OUT_CALL
      })

      return Promise.resolve()
         .then(() => {
            return signOut()
         })
         .then(() => {
            dispatch({
               type: SIGN_OUT_PASS
            })
         })
         .catch(error => {
            dispatch({
               type: SIGN_OUT_FAIL,
               error,
            })
         })
   }
}

type ConfirmSignUpUser = {
   alias: string;
   verification_code: string;
}

export function teenspotConfirmSignUp(user: ConfirmSignUpUser) {
   return async dispatch => {
      dispatch({
         type: SIGN_UP_CONFIRM_CALL,
         user,
      })

      try {
         const result = await confirmSignUp(user)
         if (result.error) {
            throw result.error
         }
         else {
            dispatch({
               type: SIGN_UP_CONFIRM_PASS,
               user,
               result: result.data,
            })
         }
      }
      catch(error) {
         dispatch({
            type: SIGN_UP_CONFIRM_FAIL,
            user,
            error,
         })
      }
   }
}

type SignInUser = {
   alias: string;
   verification_code?: string;
   password: string;
}

export function teenspotSignIn(user: SignInUser) {
   return async dispatch => {
      try {
         dispatch({
            type: SIGN_IN_CALL,
         })

         if (user.verification_code) {
            dispatch({
               type: SIGN_UP_CONFIRM_CALL
            })

            const confirmation_result = await confirmSignUp(user as SignInUser & { verification_code: string; });
            // console.log("confirmation_result", confirmation_result)

            if (!(confirmation_result.error && confirmation_result.error.message.includes('Current status is CONFIRMED'))) {
               if (confirmation_result.error) {
                  throw confirmation_result.error
               }

               dispatch({
                  type: SIGN_UP_CONFIRM_PASS,
                  user,
                  result: confirmation_result.data
               })
            }
            else {
               dispatch({
                  type: SIGN_UP_CONFIRM_FAIL,
                  error: confirmation_result.error,
               })
            }
         }

         const sign_in_result = await signIn(user)
         // console.log("sign_in_result", sign_in_result)

         if (sign_in_result.error) {
            throw sign_in_result.error;
         }

         dispatch({
            type: SIGN_IN_PASS,
            user,
            result: sign_in_result.data,
         })
      }
      catch (error) {
         if (user.verification_code) {
            dispatch({
               type: SIGN_UP_CONFIRM_FAIL,
               error,
            })
         }

         dispatch({
            type: SIGN_IN_FAIL,
            error,
         })
      }
   }
}

type SignUpUser = {
   username: string;
   password: string;
   email?: string;
   phone_number?: string;
}

export function teenspotSignUp(user: SignUpUser) {
   return async dispatch => {
      dispatch({
         type: SIGN_UP_CALL,
         user,
      })

      try {
         const result = await signUp(user);
         // console.log('signUp result', result);
         if (result.error) {
            throw result.error;
         }

         dispatch({
            type: SIGN_UP_PASS,
            user,
            result: result.data,
         })
      }
      catch(error) {
         dispatch({
            type: SIGN_UP_FAIL,
            user,
            error,
         })
      }
   }
}

type CanSendResulType = {
   can_send: boolean;
   time_remaining: number;
}

// Checks if we can send a verification code
export function canSendVerificationCode(
   previous_verification_code_send_time,
   verification_code_type = 'email'
): CanSendResulType {
   const result = {
      can_send: true,
      time_remaining: undefined,
   }

   if (previous_verification_code_send_time
      && Date.now() - previous_verification_code_send_time < SEND_VERIFICATION_CODE_TIME_INTERVAL
   ) {
      result.can_send = false
      result.time_remaining = SEND_VERIFICATION_CODE_TIME_INTERVAL - (Date.now() - previous_verification_code_send_time)
   }

   // return {
   //    can_send: false,
   //    time_remaining: '10'
   // }
   return result;
}
type CanUpdateResulType = {
   can_update: boolean;
   time_remaining?: number;
}

// Check if we can update user attribute
export function canUpdateUserAttribute(previous_update_time, update_type): CanUpdateResulType {
   if (!update_type) return { can_update: true };

   const result = {
      can_update: true,
      time_remaining: undefined,
   }

   if (previous_update_time
      && Date.now() - previous_update_time < UPDATE_USER_ATTRIBUTE_TIME_INTERVAL
   ) {
      result.can_update = false
      result.time_remaining = UPDATE_USER_ATTRIBUTE_TIME_INTERVAL - (Date.now() - previous_update_time)
   }

   // return {
   //    can_update: false,
   //    time_remaining: '10'
   // }
   return result;
}

export function teenspotConfirmEmailVerificationCode(verification_code) {
   return teenspotConfirmVerificationCode('email', verification_code)
}

export function teenspotConfirmPhoneVerificationCode(verification_code) {
   return teenspotConfirmVerificationCode('phone', verification_code)
}

export function teenspotConfirmVerificationCode(verification_type, verification_code) {
   return async (dispatch, getState, context) => {
      let confirmation_successful = false;

      try {
         dispatch({
            type: CONFIRM_VERIFICATION_CODE_CALL,
            verification_type,
         })

         const confirm_verification_code_result = await confirmVerificationCode(verification_type, verification_code)
         // await sleep(0); // testing
         // const confirm_verification_code_result = {} // testing
         if (confirm_verification_code_result.error) {
            throw confirm_verification_code_result.error
         }

         confirmation_successful = true;
         dispatch({
            type: CONFIRM_VERIFICATION_CODE_PASS,
            verification_type,
            data: confirm_verification_code_result.data
         })
      }
      catch (error) {
         dispatch({
            type: CONFIRM_VERIFICATION_CODE_FAIL,
            verification_type,
            error,
         })
      }

      if (confirmation_successful) {
         try {
            // Here probably need to update the user in the user table.
            const { apollo_client } = context;
            const { session } = getState();
            const { identity } = session;
            const result = await apollo_client.mutate({
               mutation: UPDATE_USER_MUTATION,
               variables: {
                  body: {
                     email_verified: verification_type === 'email'? true : identity.email_verified,
                     phone_verified: verification_type === 'phone'? true : identity.phone_verified,
                  }
               }
            })

            // console.log("REDUX-THUNK GRAPHQL: ", result)
         }
         catch (error) {
            console.log("REDUX-THUNK GRAPHQL ERROR: ", error)
         }

         // Also try to refresh session token
         try {
            await teenspotRefreshSessionToken()(dispatch)
         }
         catch (error) {
            console.log("Confirm Email: teenspotRefreshSessionToken error", error)
         }
      }
   }
}

export function teenspotSendEmailVerificationCode() {
   return teenspotSendVerificationCode('email')
}

export function teenspotSendPhoneVerificationCode() {
   return teenspotSendVerificationCode('phone')
}

export function teenspotSendVerificationCode(verification_type) {
   return async (dispatch, getState) => {
      try {
         dispatch({
            type: SEND_VERIFICATION_CODE_CALL,
            verification_type
         })

         if (verification_type !== 'email' && verification_type !== 'phone') {
            await sleep(0);
            throw { name: 'MissingParameterException', message: 'You need to specify \'email\' or \'phone\'' }
         }

         // Verify that we can send a verifcation code.
         const { session } = getState();
         const {
            previous_email_verification_code_send_time,
            previous_phone_verification_code_send_time
         } = session;

         let verification_code: CanSendResulType
         if (verification_type === 'email') {
            verification_code = canSendVerificationCode(previous_email_verification_code_send_time, 'email')
         }
         else {
            verification_code = canSendVerificationCode(previous_phone_verification_code_send_time, 'phone')
         }

         if (!verification_code.can_send) {
            // Dispatch failure, then return
            await sleep(0);
            throw { name: 'RequestSpamException', message: 'You can\'t send me, foo!!' }
         }

         // All clear. Send verification code
         const send_verification_result = await sendVerificationCode(verification_type)
         // const send_verification_result = {} // testing
         // console.log('RESULT: Send Verification Code', send_verification_result)
         if (send_verification_result.error) {
            throw send_verification_result.error
         }

         dispatch({
            type: SEND_VERIFICATION_CODE_PASS,
            verification_type,
            result: send_verification_result.data
         })

      }
      catch (error) {
         dispatch({
            type: SEND_VERIFICATION_CODE_FAIL,
            verification_type,
            error,
         })
      }

   }
}

export function teenspotRefreshSessionToken() {
   return async (dispatch) => {
      try {
         dispatch({
            type: REFRESH_SESSION_TOKEN_CALL,
         })

         const result = await refreshSessionToken()
         // console.log("RESULT: refreshSessionToken", result)

         dispatch({
            type: REFRESH_SESSION_TOKEN_PASS,
            result: result.session
         })
      }
      catch (error) {
         dispatch({
            type: REFRESH_SESSION_TOKEN_FAIL,
            error,
         })
      }
   }
}

export function teenspotUpdateUserEmail(attributes) {
   return teenspotUpdateUserAttributes(attributes, 'email')
}

export function teenspotUpdateUserPhone(attributes) {
   return teenspotUpdateUserAttributes(attributes, 'phone')
}

export function teenspotUpdateUserAttributes(attributes, update_type) {
   return async (dispatch, getState, context) => {
      let update_successful = false;

      try {
         dispatch({
            type: UPDATE_USER_ATTRIBUTES_CALL,
            update_type,
         })

         // Verify that we can update an attribute.
         const { session } = getState();

         const can_update = canUpdateUserAttribute(session[`previous_${update_type}_update_time`], update_type)

         if (!can_update.can_update) {
            // Dispatch failure, then return
            await sleep(0);
            throw { name: 'RequestSpamException', message: `Wait a little longer before you update your ${update_type}!` }
         }

         const result = await updateUserAttributes(attributes);

         if (result.error) {
            throw result.error
         }

         update_successful = true;
         dispatch({
            type: UPDATE_USER_ATTRIBUTES_PASS,
            update_type,
            result: result.data,
         })
      }
      catch (error) {
         dispatch({
            type: UPDATE_USER_ATTRIBUTES_FAIL,
            update_type,
            error: error,
         })
      }

      if (update_successful) {
         try {
            // Here probably need to update the user in the user table.
            const { apollo_client } = context;
            const { session } = getState();
            const { identity } = session;
            const result = await apollo_client.mutate({
               mutation: UPDATE_USER_MUTATION,
               variables: {
                  body: {
                     ...attributes,
                     email_verified: update_type === 'email'? false : (identity.email_verified || false),
                     phone_verified: update_type === 'phone'? false : (identity.phone_verified || false),
                  }
               }
            })

            // console.log("REDUX-THUNK GRAPHQL: ", result)
         }
         catch (error) {
            console.log("REDUX-THUNK GRAPHQL ERROR: ", error)
         }

         // Also try to refresh session token
         try {
            await teenspotRefreshSessionToken()(dispatch)
         }
         catch (error) {
            console.log("Confirm Email: teenspotRefreshSessionToken error", error)
         }
      }
   }
}

export function teenspotChangePassword(current_password, new_password, confirm_new_password) {
   return async (dispatch, getState, context) => {
      let update_successful = false

      try {
         dispatch({
            type: CHANGE_PASSWORD_CALL,
         })

         const result = await changePassword(current_password, new_password)
         if (result.error) {
            throw result.error
         }

         update_successful = true

         dispatch({
            type: CHANGE_PASSWORD_PASS,
            result: result.data
         })
      }
      catch (error) {
         dispatch({
            type: CHANGE_PASSWORD_FAIL,
            error,
         })
      }

      if (update_successful) {
         // Also try to refresh session token
         try {
            await teenspotRefreshSessionToken()(dispatch)
         }
         catch (error) {
            console.log("Change Password: teenspotRefreshSessionToken error", error)
         }
      }
   }
}

export function teenspotForgotPassword(username) {
   return async (dispatch, getState, context) => {
      try {
         dispatch({
            type: FORGOT_PASSWORD_CALL,
         })

         const result = await forgotPassword(username);
         if (result.error) {
            throw result.error
         }

         dispatch({
            type: FORGOT_PASSWORD_PASS,
            result: result.data
         })
      }
      catch (error) {
         dispatch({
            type: FORGOT_PASSWORD_FAIL,
            error,
         })
      }
   }
}

export function teenspotForgotPasswordSubmit(username, code, new_password) {
   return async (dispatch, getState, context) => {
      try {
         dispatch({
            type: FORGOT_PASSWORD_SUBMIT_CALL,
         })

         const result = await forgotPasswordSubmit(username, code, new_password);
         if (result.error) {
            throw result.error
         }

         dispatch({
            type: FORGOT_PASSWORD_SUBMIT_PASS,
            result: result.data
         })
      }
      catch (error) {
         dispatch({
            type: FORGOT_PASSWORD_SUBMIT_FAIL,
            error,
         })
      }
   }
}


export const initial_state = {
   login_status_checked: window.login_status_checked || false,
   identity: undefined,
   id_token: undefined,
   is_authenticated: null,
   previous_email_verification_code_send_time: null,
   previous_phone_verification_code_send_time: null,
   previous_email_update_time: null,
   previous_phone_update_time: null,

   ...composeInitialCRUDState(entity, ['up', 'in', 'out']),
   ...composeInitialCRUDState('sign_up', ['confirm']),
   ...composeInitialCRUDState('email_verification_code', ['send', 'confirm']),
   ...composeInitialCRUDState('phone_verification_code', ['send', 'confirm']),
   ...composeInitialCRUDState(SESSION_TOKEN_ENTITY, ['refresh']),
   ...composeInitialCRUDState(SESSION_TOKEN_ENTITY, ['refresh']),
   ...composeInitialCRUDState(USER_EMAIL_ENTITY, ['update']),
   ...composeInitialCRUDState(USER_PHONE_ENTITY, ['update']),
   ...composeInitialCRUDState(USER_ATTRIBUTES_ENTITY, ['update']),
   ...composeInitialCRUDState(PASSWORD_ENTITY, ['change']),
   ...composeInitialCRUDState(FORGOT_PASSWORD_ENTITY, ['reset', 'submit']),
};

export default function sessionReducer(state = initial_state, action: SessionActionTypes = {} as SessionActionTypes) {
   let channel = ''
   switch (action.type) {

      case FORGOT_PASSWORD_SUBMIT_CALL:
         state = {
            ...state,
            ...handleCRUDAction(FORGOT_PASSWORD_ENTITY, 'submit', 'CALL', undefined)
         }
         break;
      case FORGOT_PASSWORD_SUBMIT_PASS:
         state = {
            ...state,
            ...handleCRUDAction(FORGOT_PASSWORD_ENTITY, 'submit', 'PASS', action.result)
         }
         break;
      case FORGOT_PASSWORD_SUBMIT_FAIL:
         state = {
            ...state,
            ...handleCRUDAction(FORGOT_PASSWORD_ENTITY, 'submit', 'FAIL', action.error)
         }
         break;



      case FORGOT_PASSWORD_CALL:
         state = {
            ...state,
            ...handleCRUDAction(FORGOT_PASSWORD_ENTITY, 'reset', 'CALL', undefined)
         }
         break;
      case FORGOT_PASSWORD_PASS:
         state = {
            ...state,
            ...handleCRUDAction(FORGOT_PASSWORD_ENTITY, 'reset', 'PASS', action.result)
         }
         break;
      case FORGOT_PASSWORD_FAIL:
         state = {
            ...state,
            ...handleCRUDAction(FORGOT_PASSWORD_ENTITY, 'reset', 'FAIL', action.error)
         }
         break;

      case CHANGE_PASSWORD_CALL:
         state = {
            ...state,
            ...handleCRUDAction(PASSWORD_ENTITY, 'change', 'CALL', undefined)
         }
         break;
      case CHANGE_PASSWORD_PASS:
         state = {
            ...state,
            ...handleCRUDAction(PASSWORD_ENTITY, 'change', 'PASS', action.result)
         }
         break;
      case CHANGE_PASSWORD_FAIL:
         state = {
            ...state,
            ...handleCRUDAction(PASSWORD_ENTITY, 'change', 'FAIL', action.error)
         }
         break;


      case UPDATE_USER_ATTRIBUTES_CALL:
         channel = action.update_type? (action.update_type === 'email'? USER_EMAIL_ENTITY : USER_PHONE_ENTITY) : USER_ATTRIBUTES_ENTITY
         state = {
            ...state,
            ...handleCRUDAction(channel, 'update', 'CALL', undefined)
         }
         break;
      case UPDATE_USER_ATTRIBUTES_PASS:
         channel = action.update_type? (action.update_type === 'email'? USER_EMAIL_ENTITY : USER_PHONE_ENTITY) : USER_ATTRIBUTES_ENTITY
         state = {
            ...state,
            ...handleCRUDAction(channel, 'update', 'PASS', action.result),
            previous_email_update_time: action.update_type === 'email'? Date.now() : state.previous_email_update_time,
            previous_email_verification_code_send_time: action.update_type === 'email'? Date.now() : state.previous_email_verification_code_send_time,
            previous_phone_update_time: action.update_type === 'phone'? Date.now() : state.previous_phone_update_time,
            previous_phone_verification_code_send_time: action.update_type === 'phone'? Date.now() : state.previous_phone_verification_code_send_time,
         }
         break;
      case UPDATE_USER_ATTRIBUTES_FAIL:
         channel = action.update_type? (action.update_type === 'email'? USER_EMAIL_ENTITY : USER_PHONE_ENTITY) : USER_ATTRIBUTES_ENTITY
         state = {
            ...state,
            ...handleCRUDAction(channel, 'update', 'FAIL', action.error)
         }
         break;

      case REFRESH_SESSION_TOKEN_CALL:
         state = {
            ...state,
            ...handleCRUDAction(SESSION_TOKEN_ENTITY, 'refresh', 'CALL', undefined)
         }
         break;
      case REFRESH_SESSION_TOKEN_PASS:
         state = {
            ...state,
            ...handleCRUDAction(SESSION_TOKEN_ENTITY, 'refresh', 'PASS', action.result),
            is_authenticated: !!action.result? true : false,
            identity: !!action.result? parseCognitoSession(action.result) : state.identity,
            id_token: !!action.result? getIdTokenFromSession(action.result) : state.id_token,
         }
         break;
      case REFRESH_SESSION_TOKEN_FAIL:
         state = {
            ...state,
            ...handleCRUDAction(SESSION_TOKEN_ENTITY, 'refresh', 'FAIL', action.error)
         }
         break;

      case CONFIRM_VERIFICATION_CODE_CALL:
         channel = action.verification_type === 'email'? 'email_verification_code' : 'phone_verification_code'
         state = {
            ...state,
            ...handleCRUDAction(channel, 'confirm', 'CALL', undefined)
         }
         break;
      case CONFIRM_VERIFICATION_CODE_PASS:
         channel = action.verification_type === 'email'? 'email_verification_code' : 'phone_verification_code'
         state = {
            ...state,
            ...handleCRUDAction(channel, 'confirm', 'PASS', action.data),
         }
         break;
      case CONFIRM_VERIFICATION_CODE_FAIL:
         channel = action.verification_type === 'email'? 'email_verification_code' : 'phone_verification_code'
         state = {
            ...state,
            ...handleCRUDAction(channel, 'confirm', 'FAIL', action.error)
         }
         break;



      case SEND_VERIFICATION_CODE_CALL:
         channel = action.verification_type === 'email'? 'email_verification_code' : 'phone_verification_code'
         state = {
            ...state,
            ...handleCRUDAction(channel, 'send', 'CALL')
         }
         break;
      case SEND_VERIFICATION_CODE_PASS:
         channel = action.verification_type === 'email'? 'email_verification_code' : 'phone_verification_code'
         state = {
            ...state,
            ...handleCRUDAction(channel, 'send', 'PASS', action.result),
            [`previous_${channel}_send_time`]: Date.now()
         }
         break;
      case SEND_VERIFICATION_CODE_FAIL:
         channel = action.verification_type === 'email'? 'email_verification_code' : 'phone_verification_code'
         state = {
            ...state,
            ...handleCRUDAction(channel, 'send', 'FAIL', action.error)
         }
         break;



      case SIGN_IN_CALL:
         state = {
            ...state,
            ...handleCRUDAction(entity, 'in', 'CALL', undefined)
         }
         break
      case SIGN_IN_PASS:
         state = {
            ...state,
            ...handleCRUDAction(entity, 'in', 'PASS', action.result),
            identity: parseCognitoUser(action.result),
            id_token: getIdTokenFromCognitoUser(action.result),
            is_authenticated: true,
         }
         break
      case SIGN_IN_FAIL:
         state = {
            ...state,
            ...handleCRUDAction(entity, 'in', 'FAIL', action.error)
         }
         break


      case SIGN_UP_CALL:
         state = {
            ...state,
            ...handleCRUDAction(entity, 'up', 'CALL')
         }
         break
      case SIGN_UP_PASS:
         state = {
            ...state,
            ...handleCRUDAction(entity, 'up', 'PASS', (action.result || {}).user),
         }
         break
      case SIGN_UP_FAIL:
         state = {
            ...state,
            ...handleCRUDAction(entity, 'up', 'FAIL', action.error)
         }
         break


      case SIGN_OUT_CALL:
         state = {
            ...state,
            ...handleCRUDAction(entity, 'out', 'CALL', undefined)
         }
         break
      case SIGN_OUT_PASS:
         state = {
            ...state,
            ...handleCRUDAction(entity, 'out', 'PASS'),
            is_authenticated: false,
         }
         break
      case SIGN_OUT_FAIL:
         state = {
            ...state,
            ...handleCRUDAction(entity, 'out', 'FAIL', action.error)
         }
         break

      case LOG_IN_SUCCESS:
         window.login_status_checked = true
         state = {
            ...state,
            login_status_checked: true,
            is_authenticated: !!action.result? true : false,
            identity: !!action.result? parseCognitoSession(action.result) : state.identity,
            id_token: !!action.result? getIdTokenFromSession(action.result) : state.id_token,
         };
         break;

   }

   return state;
};