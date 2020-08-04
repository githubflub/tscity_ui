import Amplify from '@aws-amplify/core'
// window.LOG_LEVEL = 'VERBOSE';

export function configureAmplify() {
   Amplify.configure({
      Auth: {
         region: TS_AWS_REGION,
         userPoolId: USER_POOL_ID,
         userPoolWebClientId: USER_POOL_CLIENT_ID,
         identityPoolId: IDENTITY_POOL_ID,
      }
   })
}
