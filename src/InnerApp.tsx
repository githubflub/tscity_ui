import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
   Route,
   Switch,
} from 'react-router-dom';
import loadable from '@loadable/component'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import { TSHelmet } from 'containers/TSHelmet/TSHelmet'

// Import route components
const AppLayout = loadable(() => import(/* webpackChunkName: 'AppLayoutComponent' */ 'layouts/AppLayout'), {
   fallback: <div />
})
const Home = loadable(() => import(/* webpackChunkName: 'HomePage' */ 'routes/Home'), {
   fallback: <div />
})
const Chat = loadable(() => import(/* webpackChunkName: 'ChatPage' */ 'routes/chat'), {
   fallback: <div />
})
const Stats = loadable(() => import(/* webpackChunkName: 'StatsPage' */ 'routes/stats/StatsPage'), {
   fallback: <div />
})
const Profiles = loadable(() => import(/* webpackChunkName: 'ProfilesPage' */ 'routes/profiles'), {
   fallback: <div />
})
const ForgotPassword = loadable(() => import(/* webpackChunkName: 'ForgotPasswordPage' */ 'routes/ForgotPassword'), {
   fallback: <div />
})
const ResetPassword = loadable(() => import(/* webpackChunkName: 'ResetPasswordPage' */ 'routes/ResetPassword'), {
   fallback: <div />
})
const Dashboard = loadable(() => import(/* webpackChunkName: 'DashboardPage' */ 'routes/dashboard/Dashboard'), {
   fallback: <div />
})
const SignOutSplashScreen = loadable(() => import(/* webpackChunkName: 'SignOutSplashScreenPage' */ 'components/SignOutSplashScreen/SignOutSplashScreen'), {
   fallback: <div />
})
const Navbar = loadable(() => import(/* webpackChunkName: 'NavbarComponent' */ 'containers/Navbar'), {
   fallback: <div />
})
const Messenger = loadable(() => import(/* webpackChunkName: 'MessengerComponent' */ 'containers/Messenger/Messenger'))

export default function InnerApp(props) {
   // Get self
   useGetSelfQuery();

   // Sign out logic.
   const { sign_out_ing, sign_out_ed } = useSelector(state => state.session)
   const [sign_out_sequence, setSignOutSequence] = useState(false);
   useEffect(
      () => {
         if (sign_out_ing || sign_out_ed) {
            setSignOutSequence(true)
         }
      },
      [sign_out_ing, sign_out_ed]
   )

   return (
      <AppLayout
         header={
            sign_out_sequence? null : <Navbar />
         }
         body={
            sign_out_sequence? <SignOutSplashScreen/> : (
               <React.Fragment>
                  <TSHelmet />
                  <Switch>
                     <Route exact path="/" component={Home} />
                     <Route path="/forgot_password" component={ForgotPassword} />
                     <Route path="/reset_password" component={ResetPassword} />
                     <Route path="/chat" component={Chat} />
                     <Route path="/profiles" component={Profiles} />
                     {/* <Route path="/stats" component={Stats} /> */}
                     <Route path="/dashboard" component={Dashboard} />
                  </Switch>
                  {/*
                     Put this lower on the page so it appears
                     on top of everything. However, it shouldn't
                     appear over those draggable profile cards.
                  */}
                  <Messenger desktop />
               </React.Fragment>
            )
         }
      />
   )
}