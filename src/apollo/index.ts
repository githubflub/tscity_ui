import {
   ApolloClient,
   ApolloLink,
   HttpLink,
   InMemoryCache,
   defaultDataIdFromObject,
   onError,
} from 'apollo/apollo'

import { auth_middleware } from './auth_middleware'
import { getGraphQlEndpoint } from 'utils/getEndpoint'
import { createUserDataId } from 'apollo/utils/createUserDataId'
import possible_types from './fragment_types.json'

// Note on debugging
// Use the Apollo source code by uncommenting the import lines in this file
// and also (maybe) src/app.tsx
// and also whichever hook you're using
// (i.e., useGetSelfQuery.ts)

export function createApolloClient() {
   const graphql_endpoint = getGraphQlEndpoint()

   const client = new ApolloClient({
      link: ApolloLink.from([
         auth_middleware,
         onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors) {
               graphQLErrors.map(({ message, locations, path }) =>
                  console.log(
                     `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
                  ),
               );
            }
            if (networkError) console.log(`[Network error]: ${networkError}`);
         }),
         new HttpLink({
            uri: graphql_endpoint,
            credentials: 'same-origin'
         })
      ]),
      cache: new InMemoryCache({
         possibleTypes: possible_types,
         dataIdFromObject: (object) => {
            switch (object.__typename) {
               case 'User': {
                  return createUserDataId(object);
               }
               case 'MessageSenderType': return null; // sender.id breaks things
               default: return defaultDataIdFromObject(object);
            }
         },
         typePolicies: {
            User: {
               fields: {
                  groups: {
                     merge(existing = [], incoming: any[]) {
                        // console.log("existing", existing);
                        // console.log("incoming", incoming);

                        const existing_arr = existing
                           .map(item => item.__ref)
                        const incoming_arr = incoming
                           .map(item => item.__ref)

                        const new_arr = [ ...new Set(existing_arr.concat(incoming_arr)) ]
                        const merged = new_arr
                           .map(key => ({ __ref: key }))

                        // console.log("merged", merged);

                        return merged;
                     }
                  }
               }
            }
         },
      })
   });

   return client
}