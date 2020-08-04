import React from 'react'
import { Helmet } from 'react-helmet'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery';

export function TSHelmet(props) {
   const { notifications, message_notifications } = useGetSelfQuery();
   const {
      children,
   } = props;

   const base_title = 'TS City!'
   const total_notifications = message_notifications.length + notifications.length;
   const full_title = total_notifications > 0
      ? `(${total_notifications}) ` + base_title
      : base_title;

   return (
      <Helmet
         titleTemplate={`${full_title} - %s`}
         defaultTitle={full_title}
      >
         {children}
      </Helmet>
   )
}