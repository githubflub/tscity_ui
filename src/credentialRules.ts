//Credential constraints
export const USERNAME_MIN_LENGTH = 3; 
export const USERNAME_MAX_LENGTH = 20; 
export const PASSWORD_MAX_LENGTH = 64; 
export const PASSWORD_MIN_LENGTH = 8; 
export const VALID_USERNAME = /^[0-9a-zA-Z]+$/; 
export const VALID_PASSWORD = /^[0-9a-zA-Z! ,.#'"?]+$/; 

export function usernameIsValid(u) {
   if ( USERNAME_MIN_LENGTH <= u.length 
      && u.length <= USERNAME_MAX_LENGTH 
      && u.match(VALID_USERNAME))
   {
      return true; 
   }

   return false
}

export function passwordIsValid(pw) {
   if ( PASSWORD_MIN_LENGTH <= pw.length 
      && pw.length <= PASSWORD_MAX_LENGTH 
      && pw.match(VALID_PASSWORD))
   {
      return true; 
   } 

   return false
};

export function passwordsMatch(p1, p2) {
   if (p1 === p2) {
      return true; 
   }

   return false
};
