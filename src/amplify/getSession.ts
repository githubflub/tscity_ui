import Auth from '@aws-amplify/auth'

// Returns undefined if no session
export function getSession() {
   return Promise.resolve()
      .then(() => {
         return Auth.currentSession()
      })
      .then(result => {
         return { result }
      })
      .catch(error => {
         console.log('ERROR: Auth.currentSession - ', error)
      })
}