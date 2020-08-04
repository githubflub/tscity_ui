import Auth from '@aws-amplify/auth'
import { ISignUpResult } from 'amazon-cognito-identity-js'

type AttributesType = {
   email: string;
   phone_number: string;
}

type SignUpUser = {
   username: string;
   password: string;
   email?: string;
   phone_number?: string;
}

export function signUp(user: SignUpUser): Promise<{ data?: ISignUpResult, error?: any }> {
   return Promise.resolve()
      .then(() => {
         const attributes: AttributesType = {
            // preferred_username: user.username
         } as any

         if (user.email) {
            attributes.email = user.email.toLowerCase().trim()
         }

         if (user.phone_number) {
            attributes.phone_number = user.phone_number.toLowerCase().trim()
         }

         const signup_data = {
            username: user.username.toLowerCase().trim(),
            password: user.password,
            attributes
         }

         return Auth.signUp(signup_data)
      })
      .then(data => {
         console.log("RESULT: Auth.signUp - ", data);
         return { data }
      })
      .catch(error => {
         console.log('ERROR: Auth.signUp - ', error)
         return { error }
      })
}