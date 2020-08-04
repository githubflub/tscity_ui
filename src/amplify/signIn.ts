import Auth from '@aws-amplify/auth'

type AmplifySignInUser = {
   alias: string;
   password: string;
}

export async function signIn(user: AmplifySignInUser) {
   try {
      const data = await Auth.signIn(user.alias.toLowerCase().trim(), user.password)
      return { data }
   }
   catch (error) {
      console.log('ERROR: Auth.signIn - ', error)
      return { error }
   }

}