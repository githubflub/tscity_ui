import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress'

import './SignOutSplashScreen.scss'

const useStyles = makeStyles(createStyles({
   progress: {
      position: 'fixed',
      width: '100%',
      top: '0px',
   }
}))

function SignOutSplashScreen(props) {
   const { history } = props;
   const classes = useStyles({});
   const { sign_out_ing } = useSelector(state => state.session);

   useEffect(
      () => {
         let id;

         if (!sign_out_ing) {
            id = window.setTimeout(() => {
               window.location.href = history.createHref({ pathname: '/' })
            }, 4000)
         }

         return () => clearTimeout(id)
      },
      [sign_out_ing]
   )

   return (
      <div className="sign_out_splash_screen">
         <LinearProgress className={classes.progress} />
         <div className="sign_out_splash_screen__goodbye">{'See you again! ^^'}</div>
         <div className="sign_out_splash_screen__link">(<a onClick={() => { window.location.href = history.createHref({ pathname: '/' }) }}>Click here if you aren't redirected</a>)</div>
      </div>
   )
}

export default withRouter(SignOutSplashScreen);