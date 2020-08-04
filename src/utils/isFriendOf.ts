export function isFriendOf(self, target): boolean {
   if (self && Array.isArray(self.groups) && target && target.id) {
      for (let i = self.groups.length - 1; i >= 0; i--) {
         const user_group = self.groups[i];
         if (
            user_group.context === 'user'
            && user_group.context_id === target.id
            && user_group.group === 'friend'
         ) {
            return true;
         }
      }

      return false;
   }

   return true;
}