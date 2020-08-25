
// Apollo GraphQL
export const USE_LOCAL_GRAPHQL_SERVER = false
export function getGraphQlEndpoint() {
   return getEndpoint('GraphQL', USE_LOCAL_GRAPHQL_SERVER, API_URL_LOCAL, API_URL)
}

// WebSocket
export const USE_LOCAL_WS_LAMBDA = false
export function getWebsocketEndpoint() {
   return getEndpoint('WebSocket', USE_LOCAL_WS_LAMBDA, WS_URL_LOCAL, WS_URL)
}

export function getEndpoint(name, USE_LOCAL, LOCAL_URL, LIVE_URL) {
   switch (STACK_ENV) {
      case 'local':
         return USE_LOCAL? LOCAL_URL : LIVE_URL
      case 'dev':
         return LIVE_URL
      case 'prod':
         return LIVE_URL
      default:
         throw new Error(`Could not determine a URL for ${name} endpoint...`);
   }
}

