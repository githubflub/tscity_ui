import Auth from '@aws-amplify/auth'

export async function getCognitoUser() {
   try {
      const cognito_user = await Auth.currentAuthenticatedUser()
      return cognito_user
   }
   catch (error) {
      console.log('ERROR: Auth.currentAuthenticatedUser - ', error)
      return { error }
   }
}