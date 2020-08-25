import React from 'react'

import { withRouter } from 'hocs/withRouter'
import TSCard from 'components/TSCard'
import TSCardHeader from 'components/TSCard/components/TSCardHeader'
import TSCardContentLight from 'components/TSCard/components/TSCardContentLight'
import TSCardContentVeryLight from 'components/TSCard/components/TSCardContentVeryLight'
import TSProfilePosts from '../TSProfilePosts'

import default_user_img from 'assets/default_user_img.gif'

import 'layouts/AppLayout/AppLayout.scss'
import { useGetUserQuery } from 'apollo/hooks/useGetUserQuery'
import AddFriendButton from '../../components/AddFriendButton/AddFriendButton'
import { useGetProfileQuery } from 'apollo/hooks/useGetProfileQuery'
import { TSHelmet } from 'containers/TSHelmet/TSHelmet'

import './Profile.scss'
// Uses profileTemplateStyles.css

function Profile(props) {

   // console.log("Profile.jsx props:")
   // console.log(props)
   let account = props.params.username;
   const { args: public_user_args, user: public_user } = useGetUserQuery({ username: account });
   const public_username = public_user.display_name || public_user.username || '';
   const [args, profile] = useGetProfileQuery(public_user.username)

   // console.log("ProfileRoute args", public_user_args);
   // console.log("GET_PROFILE_QUERY results", args);

   const state = {
      image: "",
      // aboutMe: "I am me.\n\nWho are you?  TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTESTTEST TEST TEST TEST TEST TEST TEST TEST",
      aboutMe: (args.data && args.data.getProfile.about_me) || <React.Fragment>&nbsp;</React.Fragment>,
      quote: "Just on the border of your waking mind, there lies another time where darkness and light are one.",
      source: "ELO",
   }

   return (
      <div className="teenspot_app_layout__page">
         <TSHelmet><title>{public_username}</title></TSHelmet>
         <div className="teenspot_app_layout__page_container" style={{width: "100%"}}>
            <div className="ts_profile_grid">
               <TSCard className="ts_profile__header" color="blue" style={{ width: '100%' }}>
                  <TSCardHeader>{public_username}</TSCardHeader>
                  <TSCardContentVeryLight>
                     <img style={{ display: 'block' }} src={default_user_img} />
                     <AddFriendButton target={public_user} />
                  </TSCardContentVeryLight>
               </TSCard>

               <TSCard className="ts_profile__bio" color="red" style={{ flex: '7' }}>
                  <TSCardHeader>About Me</TSCardHeader>
                  <TSCardContentLight style={{ minHeight: '150px' }} >
                     <span style={{minWidth: "0"}}>{state.aboutMe}</span>
                  </TSCardContentLight>
               </TSCard>

               <TSCard className="ts_profile__posts" color="orange" style={{ flex: '14' }}>
                  <TSCardHeader>Posts</TSCardHeader>
                  <TSCardContentVeryLight style={{ minHeight: '150px' }}>
                     {args.loading? null
                        : args.error? 'Error :('
                        : <TSProfilePosts profile={args.data.getProfile} />
                     }
                  </TSCardContentVeryLight>
               </TSCard>
            </div>
         </div>
      </div>
   )
}

export default withRouter(Profile)