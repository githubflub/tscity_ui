// Only use for DMs.
export function getOppositeUser(thread, self) {
   if (thread.users.length < 1) {
      return self;
   }

   return thread.users.filter(user => user.id !== self.id)[0]
}