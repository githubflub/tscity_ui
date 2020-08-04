import Auth from '@aws-amplify/auth'

export async function updateUserAttributes(attributes = {}) {
   try {
      const user = await Auth.currentAuthenticatedUser();
      const data = await Auth.updateUserAttributes(user, attributes)
      console.log('RESULT: Auth.updateUserAttribute - ', data)
      return { data }
   }
   catch (error) {
      console.log('ERROR: Auth.updateUserAttribute - ', error)
      return { error }
   }
}