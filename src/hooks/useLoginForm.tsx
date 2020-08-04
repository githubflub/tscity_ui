import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useUpdateEffect } from 'hooks/useUpdateEffect'
import { useSignUpDialog } from 'hooks/useSignUpDialog'
import { teenspotSignIn } from 'redux_store/modules/session'

type LoginFormConfigQuery = {
   username?: string;
}

type LoginFormHookConfig = {
   query?: LoginFormConfigQuery;
}

interface FormType {
   value?: string;
   status?: string;
   message?: string;
}

interface FormInputType extends FormType {
   value: string;
}

type LoginFormState = {
   username: FormInputType,
   password: FormInputType,
   verification_code: FormInputType,
   login_form: FormType,
   show_sign_up_dialog: boolean;
   show_verification_input: boolean
}

export function useLoginForm(config?: LoginFormHookConfig) {
   const { query = {} } = config || {};

   // Connect to redux!
   const dispatch = useDispatch()
   const session = useSelector(state => state.session);
   const {
      sign_in_ing,
      sign_in_error,
      sign_up_ing,
      sign_up_error,
      sign_up_data,
   } = session

   // Connect to SignUpDialog!
   const {
      openSignUpDialog,
      SignUpDialog,
   } = useSignUpDialog()


   const [state, setState] = useState({
      username: { value: query.username || '' },
      password: { value: '' },
      verification_code: { value: '' },
      login_form: {},
      show_verification_input: false,
   } as LoginFormState)

   const validateLoginForm = () => {
      let is_valid = true
      const new_state = { ...state }
      const required_fields = {
         username: 'Please enter your username or email!',
         password: 'Please enter your password!',
      }

      Object.keys(required_fields).forEach(field => {
         if (!state[field].value) {
            is_valid = false
            new_state[field] = {
               ...state[field],
               status: 'error',
               message: required_fields[field]
            }
         }
      })

      if (!is_valid) {
         setState(new_state)
      }

      return is_valid

   }

   const handleLoginFormSubmit = (event) => {
      // On a regular old submit, the page will refresh.
      // Call preventDefault() to stop this behavior.
      event.preventDefault();

      if (!validateLoginForm()) {
         return;
      }

      const signin_variables = {
         alias: state.username.value,
         password: state.password.value,
         verification_code: state.verification_code.value,
      }

      dispatch(teenspotSignIn(signin_variables))
   }

   useUpdateEffect(
      () => {
         if (!sign_in_ing) {
            if (sign_in_error) {
               if (sign_in_error.name === 'UserNotConfirmedException') {
                  setState({
                     ...state,
                     show_verification_input: true,
                     verification_code: {
                        ...state.verification_code,
                        status: 'error',
                        message: 'You must verify your email before you can log in. Please check your email!'
                     }
                  })
               }
               else if (
                  sign_in_error.name === 'UserNotFoundException'
                  || (sign_in_error.message || '').includes('Incorrect username or password')
               ) {
                  setState({
                     ...state,
                     login_form: {
                        ...state.login_form,
                        status: 'error',
                        message: 'Incorrect username or password'
                     }
                  })
               }
               else {
                  setState({
                     ...state,
                     login_form: {
                        ...state.login_form,
                        status: 'error',
                        message: 'Something went wrong... Try again?',
                        // message: sign_in_error.message,
                     }
                  })
               }
            }
         }
      },
      [sign_in_ing]
   )

   useUpdateEffect(
      () => {
         if (!sign_up_ing) {
            if (sign_up_error) {
               // Sign up errors are handled
               // elsewhere.
            }
            else {
               setState({
                  ...state,
                  show_verification_input: true,
                  username: {
                     value: sign_up_data.username || ''
                  }
               })
            }
         }
      },
      [sign_up_ing]
   )

   const onLoginFormChange = event => {
      setState({
         ...state,
         login_form: {},
         [event.target.name]: {
            value: event.target.value || ''
         }
      })
   }

   return {
      username: state.username,
      password: state.password,
      verification_code: state.verification_code,
      login_form: state.login_form,
      handleLoginFormSubmit,
      onLoginFormChange,
      ForgotPasswordLink: (
         <Link to={{
            pathname: '/forgot_password',
            search: state.username.value? `?username=${state.username.value}` : '',
         }}>Forgot password?</Link>
      ),
      SignUpLink: (
         <a id="myBtn" href="javascript:void(0)" onClick={openSignUpDialog}>Sign up</a>
      ),
      SignUpDialog,
      show_verification_input: state.show_verification_input,
   }
}