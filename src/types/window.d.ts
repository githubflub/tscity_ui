import { compose } from 'redux'

declare global {
   interface Window {
      login_status_checked: boolean;
      __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
      LOG_LEVEL: string;
      grecaptcha: { render: Function };
   }
}