import Auth from '@aws-amplify/auth'

export type ConfirmSignUpUser = {
   alias: string;
   verification_code: string;
   [key: string]: any;
}

export async function confirmSignUp(user: ConfirmSignUpUser) {
   console.log("confirm sign up user", user);
   try {
      const data = await Auth.confirmSignUp(user.alias.toLowerCase().trim(), user.verification_code)
      return { data }
   }
   catch (error) {
      console.log('ERROR: Auth.confirmSignUp - ', error)
      return { error }
   }
}