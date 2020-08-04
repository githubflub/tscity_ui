export function createUserDataId(user, typename = 'User') {
   return `${user.username}-${typename}`
}