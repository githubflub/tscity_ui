import { v4 as uuid } from 'uuid';

class ResizeListenerClass {
   private static instance_count = 0;
   private subscribers = {};

   constructor() {
      ResizeListenerClass.instance_count += 1;
      console.log("ResizeListenerClass instances:", ResizeListenerClass.instance_count)

      // This is so addEventListener and removeEventListener work properly.
      this.push = this.push.bind(this);
   }

   push() {
      Object.keys(this.subscribers).forEach(key => {
         const subscriber = this.subscribers[key];

         // this.subscribers not always up to date.
         if (subscriber) {
            subscriber.onEvent()
         }
      })
   }

   subscribe(handlers: { onEvent: () => any }) {
      if (!Object.keys(this.subscribers).length) {
         window.addEventListener('resize', this.push)
      }

      const key = uuid();

      const subscription = {
         unsubscribe: () => {
            this.unsubscribe(key);
         }
      }

      this.subscribers[key] = handlers;

      return subscription;
   }

   unsubscribe(key) {
      delete this.subscribers[key];

      // Remove event listener so garbage collection
      // can occur on hot reloads while developing...
      if (!Object.keys(this.subscribers).length) {
         window.removeEventListener('resize', this.push);
      }
   }
}

export const ResizeListener = new ResizeListenerClass();