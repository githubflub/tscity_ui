import { getCognitoUser } from './getCognitoUser';

export async function refreshSessionToken(): Promise<{ error?: any, session?: any }> {
   try {
      const cognito_user = await getCognitoUser();

      if (typeof cognito_user.getSession !== 'function') {
         // Safeguard against trying to refresh a user signed
         // in through facebook, which doesn't work right now.
         return undefined;
      }

      const result: any = await new Promise((resolve, reject) => {
         cognito_user.getSession((error, session) => {
            if (error) {
               resolve({ error })
            }
            else {
               resolve({ session, cognito_user })
            }
         })
      })

      if (!result) {
         return undefined;
      }
      else if (result.error) {
         throw result.error
      }

      return await new Promise((resolve, reject) => {
         result.cognito_user.refreshSession(result.session.refreshToken, (error, session) => {
            if (error) {
               reject(error)
            }
            else {
               resolve({ session })
            }
         })
      })

   }
   catch (error) {
      console.log("ERROR: refreshSessionToken", error)
      return { error }
   }
}