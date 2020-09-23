import Auth from '@aws-amplify/auth'

export async function sendVerificationCode(type) {
   try {
      const data = await Auth.verifyCurrentUserAttribute(type === 'phone'? 'phone_number' : type)
      // console.log('RESULT: Auth.verifyCurrentUserAttribute - ', data)
      return { data }
   }
   catch (error) {
      console.log('ERROR: Auth.verifyCurrentUserAttribute - ', error)
      return { error }
   }
}