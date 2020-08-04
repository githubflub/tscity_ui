import { Thread } from 'lib/schema/thread/typedef';
import { Message } from 'lib/schema/message/typedef';

type ExtraThreadFields = {
   messages?: Message[], last_read_time?: string;
}

export function prepareNewDMs(getMyDMs, { thread, message }) {
   // console.log('message', message)
   // console.log('thread', thread);
   const prev_thread: Thread & ExtraThreadFields = getMyDMs.find(t => t.id === thread.id);
   let new_dms = getMyDMs.filter(item => item.id !== thread.id);
   // console.log("new_dms", new_dms);
   let duplicate_message = false;
   const prev_messages = ((prev_thread || {}).messages || [])
      .filter(msg => {
         if (msg.id === message.id) {
            duplicate_message = true;
            return false;
         }

         return true;
      })

   new_dms = [
      {
         ...thread,
         // It seems like Apollo tries to merge
         // objects in arrays. So, if a new object
         // in an array has the same ID as an old object
         // in the array, Apollo will try to merge them.
         //
         // This behavior might make you think it's ok
         // to pass "incomplete" objects to the cache,
         // because you see that they get accepted
         // with only a warning, but in fact, the cache
         // strictly requires all the
         // properties declared by the query/mutation.
         //
         // When it accepts incomplete data, it's because
         // you were lucky and it found an older existing
         // object with which to fill the missing properties,
         // but if there was no older object. There will be
         // hard errors!
         last_read_time: prev_thread
            ? prev_thread.last_read_time
            : null,
         messages: duplicate_message
            ? (prev_thread || {}).messages
            : [
               // NOTE: can't use spread operator on
               //       undefined in an array,
               //       only in objects.
               ...prev_messages,
               message
            ]
      },
      ...new_dms
   ]

   // console.log("final new_dms", new_dms);

   return new_dms;
}