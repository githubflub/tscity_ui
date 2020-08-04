import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import axios from 'axios'
import * as credRules from 'credentialRules'

import { teenspotSignUp } from 'redux_store/modules/session'
import BootstrapInput from 'components/BootstrapInput'
import BootstrapAlert from 'components/BootstrapAlert'
import FormGroup from 'components/FormGroup'
import FormGroupLabel from 'components/FormGroupLabel'
import HelpText from 'components/HelpText'
import Loading from 'components/Loading'
import SignUpSuccessMessage from './components/SignUpSuccessMessage'
import Button from '@material-ui/core/Button'
import GreCaptcha from 'containers/GreCaptcha'

import './ModalSignUpForm.scss'

class ModalSignUpForm extends Component {
   constructor(props) {
      super(props);
      this.state = {
         username: { value: '' },
         password: { value: '' },
         confirm_password: { value: '' },
         email: { value: '' },
         phone_number: { value: '' },
         form: {},

         is_loading: false,
         success: false,
         form_height: undefined,
         form_width: undefined,
         captcha_passed: false,
      };

   }

   componentDidMount() {
      const node = document.getElementById('teenspot_modal_sign_up_form')
      if (node) {
         this.setState({
            form_height: node.clientHeight,
            form_width: node.clientWidth,
         })
      }
   }

   componentDidUpdate(prev_props, prev_state) {
      if (prev_props.sign_up_ing && !this.props.sign_up_ing) {
         this.setState({ is_loading: false })
         if (this.props.sign_up_error) {
            if (this.props.sign_up_error.name === 'UsernameExistsException') {
               this.setState({
                  username: {
                     ...this.state.username,
                     status: 'error',
                     message: 'This username is taken! :('
                  }
               })
            }
            else if (this.props.sign_up_error.name === 'InvalidLambdaResponseException') {
               this.setState({
                  form: {
                     ...this.state.form,
                     status: 'error',
                     message: 'We had trouble sending you a verification email. :/'
                  }
               })
            }
         }
         else {
            this.setState({ success: true })
         }
      }
   }

   onChange = (event) => {
      this.setState({
         form: {},
         [event.target.name]: {
            value: event.target.value
         }
      });
   }

   validateForm = () => {
      const {
         username,
         password,
         confirm_password,
         email,
         phone_number,
      } = this.state

      let is_valid = true
      const new_state = {}
      const required_fields = {
         username: 'Please choose a username!',
         email: 'Please enter your email address!',
         password: 'Please choose a password!',
         confirm_password: 'Please confirm your password!',
      }

      // Make sure each field is filled in
      Object.keys(required_fields).forEach(field => {
         if (!this.state[field].value) {
            is_valid = false
            new_state[field] = {
               ...this.state[field],
               status: 'error',
               message: required_fields[field]
            }
         }
      })

      // Check username
      if (!(new_state.username || {}).status) {
         if (!credRules.usernameIsValid(username.value)) {
            is_valid = false
            new_state.username = {
               ...this.state.username,
               status: 'error',
               message: 'A username may only contain...'
            }
         }
      }

      // Check password
      if (!(new_state.password || {}).status) {
         if (!credRules.passwordIsValid(password.value)) {
            is_valid = false
            new_state.password = {
               ...this.state.password,
               status: 'error',
               message: 'A password may only contain...'
            }
         }
      }

      // Check confirm_password
      if (!(new_state.confirm_password || {}).status) {
         if (this.state.confirm_password.value !== this.state.password.value) {
            is_valid = false
            new_state.confirm_password = {
               ...this.state.confirm_password,
               status: 'error',
               message: 'Passwords don\'t match!',
            }
         }
      }

      if (!is_valid) {
         this.setState(new_state)
      }

      return is_valid
   }


   handleSubmit = (event) => {
      const {
         username,
         password,
         email,
         phone_number,
      } = this.state
      event.preventDefault();

      if (!this.validateForm()) {
         return
      }

      // show loading bar while submitting
      this.setState({
         is_loading: true
      });

      const user = {
         username: username.value,
         password: password.value,
      }

      if (email.value) {
         user.email = email.value
      }
      else if (phone_number.value) {
         user.phone_number = phone_number.value
      }


      this.props.teenspotSignUp(user)
   }

   onSuccessClick = (event) => {
      event.preventDefault()

      this.props.onClose()
   }

   onGreCaptchaCallback = (captcha_response_token) => {
      this.setState({
         captcha_passed: true
      })
   }


   render() {
      const {
         username,
         password,
         confirm_password,
         email,
         phone_number,
         form,

         form_height,
         form_width,
         captcha_passed,
      } = this.state

      let modalBody = null;
      let modal_body_styles = {
         height: form_height || '338px',
         width: form_width || '339px',
         maxWidth: '100%',
         maxHeight: '100%',
      }

      if (this.state.is_loading) {
         modalBody = (
            <div style={modal_body_styles}>
               <Loading />
            </div>
         )
      }
      else if (this.state.success) {
         modalBody = (
            <div style={modal_body_styles}>
               <SignUpSuccessMessage onClick={this.onSuccessClick}/>
            </div>
         )
      } else {
         modalBody = (
            <form id="signUpForm" className="teenspot_sign_up_form">
               {/*Username input field*/}
               <FormGroup status={username.status}>
                  <FormGroupLabel htmlFor="ModalSignUpForm_bsinput_username">Username</FormGroupLabel>
                  <BootstrapInput
                     id="ModalSignUpForm_bsinput_username"
                     type="text"
                     name="username"
                     placeholder="Username"
                     value={username.value}
                     onChange={this.onChange}
                     autoComplete="username"
                  />
                  <HelpText show={username.status === 'error'}>{username.message}</HelpText>
               </FormGroup>

               {/*Email input field*/}
               <FormGroup status={email.status}>
                  <FormGroupLabel htmlFor="bootstrap-input-email">Email</FormGroupLabel>
                  <BootstrapInput
                     type="email"
                     id="bootstrap-input-email"
                     placeholder="Email"
                     name="email"
                     autoComplete="email"
                     value={email.value}
                     onChange={this.onChange}
                  />
                  <HelpText show={email.status === 'error'}>{email.message}</HelpText>
               </FormGroup>

               {/*Password input field*/}
               <FormGroup status={password.status}>
                  <FormGroupLabel htmlFor="ModalSignUpForm_bsinput_password">Password</FormGroupLabel>
                  <BootstrapInput
                     id="ModalSignUpForm_bsinput_password"
                     type="password"
                     name="password"
                     placeholder="Password"
                     value={password.value}
                     onChange={this.onChange}
                     autoComplete="new-password"
                  />
                  <HelpText show={password.status === 'error'}>{password.message}</HelpText>
               </FormGroup>


               {/*Confirm Password input field*/}
               <FormGroup status={confirm_password.status}>
                  <FormGroupLabel htmlFor="ModalSignUpForm_bsinput_confirm_password">Confirm Password</FormGroupLabel>
                  <BootstrapInput
                     id="ModalSignUpForm_bsinput_confirm_password"
                     type="password"
                     name="confirm_password"
                     placeholder="Enter your password again"
                     value={confirm_password.value}
                     onChange={this.onChange}
                     autoComplete="new-password"
                  />
                  <HelpText show={confirm_password.status === 'error'}>{confirm_password.message}</HelpText>
               </FormGroup>

               <GreCaptcha onGreCaptchaCallback={this.onGreCaptchaCallback} />

               {/*NOTE: Buttons don't need to be in a div*/}
               <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmit}
                  disabled={!captcha_passed}
               >
                  Sign Up
               </Button>
            </form>
         )
      }

      return (
         <div id="teenspot_modal_sign_up_form" className="teenspot_sign_up_modal">
            <BootstrapAlert show={!!form.status} status={form.status}>{form.message}</BootstrapAlert>
            {modalBody}
         </div>
      );
   }
}

export default connect(
   state => ({
      ...state.session
   }),
   dispatch => ({
      teenspotSignUp: bindActionCreators(teenspotSignUp, dispatch)
   })
)(ModalSignUpForm)