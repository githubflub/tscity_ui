import Auth from '@aws-amplify/auth'

export async function changePassword(old_password: string, new_password: string) {
   try {
      const cognito_user = await Auth.currentAuthenticatedUser()
      const data = await Auth.changePassword(cognito_user, old_password, new_password)
      console.log(`RESULT: amplify.changePassword - `, data)
      return { data }
   }
   catch (error) {
      console.log(`ERROR: amplify.changePassword -`, error)
      return { error }
   }
}