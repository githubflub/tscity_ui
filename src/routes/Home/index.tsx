// jsx files compile way faster, so use JSX

import * as React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux';

import HomeLoginForm from './containers/HomeLoginForm'
import Welcome from './containers/Welcome/Welcome'
import cat_webm from 'assets/cat.webm'

import 'layouts/AppLayout/AppLayout.scss'
import './Home.scss'

type HomePageProps = {
   [any: string]: any;
}

class Home extends Component<HomePageProps> {
   componentWillMount() {
      // Scroll up on route change
      window.scrollTo(0, 0);
   }

   render() {
      const { session } = this.props;

      let loginPanel = null;
      if (session.is_authenticated === null) {
         loginPanel = null;
      } else if (!session.is_authenticated) {
         loginPanel = <HomeLoginForm/>;
      } else {
         loginPanel = <Welcome /> ;
      }

      return (
         <div className="teenspot_app_layout__page home">
            <div className="teenspot_app_layout__page_container home_container">
               <div className="home_row_main">
                  <div className="home_row_main__left">
                     <video width="100%" controls loop>
                           <source src={cat_webm} type="video/webm"/>
                     </video>
                  </div>

                  <div className="home_row_main__right">
                     {loginPanel}
                  </div>
               </div>
            </div>
         </div>
      )
   }
}

export default connect(
   state => ({
      session: state.session,
   }),
   null,
)(Home)