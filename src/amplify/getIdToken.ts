export function getIdTokenFromSession(session) {
   // console.log('getIdTokenFromSession', session);
   const id_token = session.idToken.jwtToken;
   return id_token;
}

export function getIdTokenFromCognitoUser(cognito_user) {
   // console.log('getIdTokenFromCognitoUser', cognito_user);
   const id_token = getIdTokenFromSession(cognito_user.signInUserSession);
   return id_token;
}