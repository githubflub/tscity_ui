import Auth from '@aws-amplify/auth'

export async function forgotPassword(username) {
   try {
      const data = await Auth.forgotPassword(username)
      // console.log(`RESULT: amplify.forgotPassword - `, data)
      return { data }
   }
   catch (error) {
      console.log(`ERROR: amplify.forgotPassword -`, error)
      return { error }
   }
}