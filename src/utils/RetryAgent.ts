// Attach the following methods to your process...
//    onConnectAttempt
//    onConnected
// Then use retry method wherever you need it.
//

export class RetryAgent {
   private connect_attempts_count = 0;
   private max_attempts = 0; // 0 for unlimited attempts!
   private connect_delay_timeout;
   private STARTING_DELAY = 1000
   private MAX_DELAY = 1000 * 60 * 60 * 12 // 12 hours
   // private MAX_DELAY = 1000 * 5 // 5 secondes
   private name = '';
   private func; // Also serves as is_retrying flag.

   constructor(options = {}) {
      if (typeof options === 'string') {
         this.name = options.trim() + ' ';
      }
      else {
         Object.assign(this, options);
      }
   }

   public onNetworkRestored = () => {
      // Note the 'online' event doesn't really
      // tell you when a user's internet access is
      // restored.
      console.log(`Network restored!`)
      if (
         this.func
         && (
            this.connect_delay_timeout
            || (this.connect_attempts_count >= this.max_attempts)
         )
      ) {
         this.retry(this.func, true)
      }
   }

   public clearTimeout() {
      this.connect_delay_timeout = clearTimeout(this.connect_delay_timeout)
   }

   public onConnectAttempt() {
      this.connect_attempts_count++;
      this.clearTimeout();
   }

   public onConnected() {
      this.connect_attempts_count = 0;
      this.clearTimeout();
      if (!!this.func) console.log(`...${this.name}retry successful!`)
      this.func = undefined;
   }

   private getBackoffTime() {
      let time = this.STARTING_DELAY * Math.pow(2, this.connect_attempts_count)
      return time
   }

   public retry(func: Function, no_delay?: boolean, callback?: Function) {
      this.func = func;
      window.addEventListener('online', this.onNetworkRestored.bind(this));
      if (no_delay) {
         this.connect_attempts_count = 0;
      }

      if (
         this.max_attempts === 0
         || (this.max_attempts > this.connect_attempts_count)
      ) {
         const delay = +!no_delay * Math.min(this.getBackoffTime(), this.MAX_DELAY)
         console.log(`${this.name}retrying in ${delay/1000} seconds.`);
         const delayedFunc = () => {
            console.log(`${this.name}retrying now!...`)
            this.clearTimeout();
            window.removeEventListener('online', this.onNetworkRestored);
            func()
         }

         if (delay) {
            this.connect_delay_timeout = window.setTimeout(
               delayedFunc,
               delay
            )
            callback && callback({ delay })
         }
         else {
            delayedFunc();
         }
      }
      else {
         console.log(`${this.name}maximum attempts reached. Giving up.`)
      }
   }
}