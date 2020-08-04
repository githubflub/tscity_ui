export function isWebmaster(user) {
   let is_webmaster = false;

   if (user && Array.isArray(user.groups)) {
      for (let i = (user.groups || []).length - 1; i >= 0; i--) {
         const user_group = user.groups[i];
         if (user_group.group === 'webmaster') {
            is_webmaster = true;
            break;
         }
      }
   }

   return is_webmaster
}