import profiles from './profiles'
import reset_password from './reset_password'
import forgot_password from './forgot_password'

export default {
   '/': {
      path: '/',
      data: {},
      children: {
         forgot_password,
         profiles,
         reset_password,
      }
   }
}