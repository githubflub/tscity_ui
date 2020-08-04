export function parseCognitoSession(session) {
   const identity = session.idToken.payload; 
   return identity; 
} 

export function parseCognitoUser(cognito_user) {
   const identity = parseCognitoSession(cognito_user.signInUserSession); 
   return identity
}