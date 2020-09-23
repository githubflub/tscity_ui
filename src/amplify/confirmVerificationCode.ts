import Auth from '@aws-amplify/auth'

export async function confirmVerificationCode(type: string, verification_code: string) {
   try {
      const data = await Auth.verifyCurrentUserAttributeSubmit(type === 'phone'? 'phone_number' : type, verification_code)
      // console.log('RESULT: Auth.verifyCurrentUserAttribute - ', data)
      return { data }
   }
   catch (error) {
      console.log('ERROR: Auth.verifyCurrentUserAttributeSubmit - ', error)
      return { error }
   }
}