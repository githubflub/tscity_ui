import React, { Component } from 'react'
import TSCard from 'components/TSCard'
import TSCardHeader from 'components/TSCard/components/TSCardHeader'
import TSCardContentLight from 'components/TSCard/components/TSCardContentLight'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'

function Welcome(props) {
   const { args, user } = useGetSelfQuery()
   const username = user.display_name || user.username || '';

   return (
      <TSCard color="red">
         <TSCardHeader>Welcome, {username}!</TSCardHeader>
         <TSCardContentLight>{`I'm not sure what to show here. >.< Just go check out the chat and dashboard! `}</TSCardContentLight>
      </TSCard>
   )
}

export default Welcome;