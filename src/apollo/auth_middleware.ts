import { getIdentityToken } from 'amplify/getIdentityToken'
import { setContext } from 'apollo-link-context';

export const auth_middleware = setContext(async (request, previousContext) => {
   let context_update = {};

   const identity_token = await getIdentityToken();

   // Add auth header
   context_update = {
      headers: {
         authorization: identity_token,
      }
   }

   return context_update;
})