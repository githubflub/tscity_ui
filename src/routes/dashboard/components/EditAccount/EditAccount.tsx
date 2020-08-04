import React from 'react';
import EditRowsWithMobile from '../EditRowsWithMobile/EditRowsWithMobile'
import EditEmail from './EditEmail'
// import EditPhone from './EditPhone'
import EditPassword from './EditPassword'
import EditUsernameCapitalization from './EditUsernameCapitalization/EditUsernameCapitalization'

function EditAccount(props) {
   const comps = [
      <EditUsernameCapitalization />,
      <EditEmail />,
      // <EditPhone />, // Don't wanna pay for SMS
      <EditPassword />,
   ]

   return (
      <React.Fragment>
         <EditRowsWithMobile
            title={"Edit Account"}
            rows={comps}
            color="red"
         />
         {/* <div style={{ marginBottom: '10px' }}></div>
         <EditRows
            title="Delete Account"
            color="red"
            rows={['Delete Account']}
         /> */}
      </React.Fragment>
   );
}



export default EditAccount;