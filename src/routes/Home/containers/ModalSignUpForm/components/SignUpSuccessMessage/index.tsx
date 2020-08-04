import * as React from 'react'
import Button from '@material-ui/core/Button'

import './SignUpSuccessMessage.scss'

function SignUpSuccessMessage(props) {
   return (
      <div className="sign_up_success_message">
         <div className="sign_up_success_message__top_half">
            <div className="sign_up_success_message__main">{`Welcome back to TS!`}</div>
         </div>

         <div className="sign_up_success_message_middle">
            {"You're all signed up! Check your email for a verification code and use it with your first login."}
         </div>
         <div className="sign_up_success_message__bottom_half">
            <Button
               variant="contained"
               color="primary"
               onClick={props.onClick}
            >
               Get Started
            </Button>
         </div>
      </div>
   )
}

export default SignUpSuccessMessage

