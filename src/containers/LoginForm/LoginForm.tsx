import React from 'react'
import { useSelector } from 'react-redux'
import { useLoginForm } from 'hooks/useLoginForm';
import BootstrapInput from 'components/BootstrapInput'
import FormGroup from 'components/FormGroup'
import FormGroupLabel from 'components/FormGroupLabel'
import HelpText from 'components/HelpText'
import BootstrapAlert from 'components/BootstrapAlert'
import { useLocation } from 'react-router-dom'
import Button from '@material-ui/core/Button';

export default function LoginForm(props) {
   const location = useLocation();
   const { sign_in_ing } = useSelector(state => state.session);
   const {
      login_form,
      username,
      password,
      show_verification_input,
      verification_code,
      ForgotPasswordLink,
      SignUpLink,
      SignUpDialog,
      handleLoginFormSubmit,
      onLoginFormChange,
   } = useLoginForm({ query: location.query })

   return (
      <React.Fragment>
         <BootstrapAlert show={!!login_form.status} status={login_form.status}>{login_form.message}</BootstrapAlert>
         <form onSubmit={handleLoginFormSubmit}>
            <FormGroup status={username.status || login_form.status}>
               <FormGroupLabel htmlFor="bootstrap-input-username">Username</FormGroupLabel>
               <BootstrapInput
                  type="text"
                  id="bootstrap-input-username"
                  name="username"
                  placeholder="Username or email"
                  autoComplete="username"
                  value={username.value}
                  onChange={onLoginFormChange}
               />
               <HelpText show={username.status === 'error'}>{username.message}</HelpText>
            </FormGroup>

            <FormGroup status={password.status || login_form.status}>
               <FormGroupLabel htmlFor="bootstrap-input-password">Password</FormGroupLabel>
               <BootstrapInput
                  type="password"
                  id="bootstrap-input-password"
                  placeholder="Password"
                  name="password"
                  autoComplete="current-password"
                  value={password.value}
                  onChange={onLoginFormChange}
               />
               <HelpText show={password.status === 'error'}>{password.message}</HelpText>
            </FormGroup>

            {show_verification_input && <FormGroup status={verification_code.status || login_form.status}>
               <FormGroupLabel htmlFor="bootstrap-input-verification_code">Verification Code</FormGroupLabel>
               <BootstrapInput
                  type="number"
                  pattern="[0-9]*"
                  id="bootstrap-input-verification_code"
                  name="verification_code"
                  placeholder="Verification Code"
                  autoComplete="new-password"
                  value={verification_code.value}
                  onChange={onLoginFormChange}
               />
               <HelpText show={verification_code.status === 'error'}>{verification_code.message}</HelpText>
            </FormGroup>}

            {/* Submit button */}
            <FormGroup>
               <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={sign_in_ing}
               >
                  Login
               </Button>
            </FormGroup>
         </form>

         {/* Modal Button*/}
         <div>{ForgotPasswordLink}<br/>Don't have an account? {SignUpLink}</div>

         {SignUpDialog}
      </React.Fragment>
   );
}