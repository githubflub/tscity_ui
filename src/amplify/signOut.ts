import Auth from '@aws-amplify/auth'

export async function signOut() {
   try {
      const data = await Auth.signOut()
      return data
   }
   catch(error) {
      console.log('ERROR: Auth.signOut - ', error)
      return error;
   }
}