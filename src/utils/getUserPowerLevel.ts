import { isWebmaster } from './isWebmaster'
import { isModerator } from './isModerator'

export function getUserPowerLevel(context, context_id, user) {
   let power_level = 'user';

   if (isWebmaster(user)) {
      power_level = 'webmaster'
   }
   else if (isModerator(user)) {
      power_level = 'moderator'
   }

   return power_level;
}