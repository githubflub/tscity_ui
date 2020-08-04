import React from 'react';
import EditRowsWithMobile from '../EditRowsWithMobile/EditRowsWithMobile'

export default function Notifications(props) {
   const rows = [
      "Here is a summary of stuff"
   ]

   return (
      <EditRowsWithMobile
         title="Notifications"
         rows={rows}
         color="teal"
      />
   )
}