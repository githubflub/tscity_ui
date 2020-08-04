import React from 'react'

import LoginForm from 'containers/LoginForm/LoginForm'


import TSCard from 'components/TSCard'
import TSCardHeader from 'components/TSCard/components/TSCardHeader'
import TSCardContentLight from 'components/TSCard/components/TSCardContentLight'

function HomeLoginForm(props) {
   return (
      <TSCard color="red">
         <TSCardHeader>Login</TSCardHeader>

         <TSCardContentLight>
            <LoginForm />
         </TSCardContentLight>
      </TSCard>
   );
}

export default HomeLoginForm