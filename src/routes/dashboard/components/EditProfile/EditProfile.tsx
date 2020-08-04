import React from 'react';
import EditRowsWithMobile from '../EditRowsWithMobile/EditRowsWithMobile'
import EditAboutMe from './EditAboutMe/EditAboutMe'
import EditPrivacy from './EditPrivacy/EditPrivacy'

function EditProfile(props) {
   const components = [
      <EditPrivacy />,
      <EditAboutMe />
   ]

   return (
      <EditRowsWithMobile
         title="Edit Profile"
         rows={components}
         color="orange"
      />
   );
}

export default EditProfile;