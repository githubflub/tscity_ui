export function isModerator(user) {
   let is_moderator = false;

   if (user && Array.isArray(user.groups)) {
      for (let i = (user.groups || []).length - 1; i >= 0; i--) {
         const user_group = user.groups[i];
         if (user_group.group === 'moderator') {
            is_moderator = true;
            break;
         }
      }
   }

   return is_moderator
}