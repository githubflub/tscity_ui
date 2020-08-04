import { getSession } from 'amplify/getSession'

export async function getIdentityToken() {
   const session = await getSession()
   // console.log("auth_middleware: session", session)

   let identity_token = 'lurkertoken';
   if (session) {
      identity_token = session.result.getIdToken().getJwtToken()
   }

   return identity_token
}