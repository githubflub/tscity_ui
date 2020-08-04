import scss_variables from '../src/stylesheets/scss_variables.json';

const environment_variables = {
   NODE_ENV: JSON.stringify(process.env.NODE_ENV),
   DEV_ENV: JSON.stringify(process.env.DEV_ENV),
   STACK_ENV: JSON.stringify(process.env.STACK_ENV),
   BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),

   // AWS Cognito environment vars
   TS_AWS_REGION: JSON.stringify(process.env.TS_AWS_REGION),
   USER_POOL_ID: JSON.stringify(process.env.USER_POOL_ID),
   USER_POOL_CLIENT_ID: JSON.stringify(process.env.USER_POOL_CLIENT_ID),
   IDENTITY_POOL_ID: JSON.stringify(process.env.IDENTITY_POOL_ID),
   IOT_ENDPOINT_UI: JSON.stringify(process.env.IOT_ENDPOINT_UI),

   // Google reCAPTCHA vars
   RECAPTCHA_SITE_KEY: JSON.stringify(process.env.RECAPTCHA_SITE_KEY),

   // URLs and ports
   SITE_URL: JSON.stringify(process.env.SITE_URL),
   SITE_URL_LOCAL_PORT: JSON.stringify(process.env.SITE_URL_LOCAL_PORT),
   API_LOCAL_PORT: JSON.stringify(process.env.API_LOCAL_PORT),
   WS_LOCAL_PORT: JSON.stringify(process.env.WS_LOCAL_PORT),
   ANALYZER_URL_LOCAL_PORT: JSON.stringify(process.env.ANALYZER_URL_LOCAL_PORT),
   SOURCE_MAP_PORT: JSON.stringify(process.env.SOURCE_MAP_PORT),
   LOCAL_BUILD_PORT: JSON.stringify(process.env.LOCAL_BUILD_PORT),
   API_URL_LOCAL: JSON.stringify(process.env.API_URL_LOCAL),
   API_URL: JSON.stringify(process.env.API_URL),
   WS_URL_LOCAL: JSON.stringify(process.env.WS_URL_LOCAL),
   WS_URL: JSON.stringify(process.env.WS_URL),

   TABLET_SIZE: scss_variables.TABLET_SIZE,
   MOBILE_SIZE: scss_variables.MOBILE_SIZE,
}

export default environment_variables