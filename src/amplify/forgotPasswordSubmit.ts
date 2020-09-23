import Auth from '@aws-amplify/auth'

export async function forgotPasswordSubmit(username, code, new_password) {
   try {
      const data = await Auth.forgotPasswordSubmit(username, code, new_password)
      // console.log(`RESULT: amplify.forgotPasswordSubmit - `, data)
      return { data }
   }
   catch (error) {
      console.log(`ERROR: amplify.forgotPasswordSubmit -`, error)
      return { error }
   }
}