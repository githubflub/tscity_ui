import { ApolloClient } from 'apollo-client';
import {
   InMemoryCache,
   defaultDataIdFromObject,
   IdGetterObj,
   IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { auth_middleware } from './auth_middleware'
import { User } from 'lib/schema/user/typedef'
import { getGraphQlEndpoint } from 'utils/getEndpoint'
import { createUserDataId } from 'apollo/utils/createUserDataId'
import introspectionQueryResultData from './fragment_types.json'

export function createApolloClient() {
   const graphql_endpoint = getGraphQlEndpoint()

   const fragmentMatcher = new IntrospectionFragmentMatcher({
      introspectionQueryResultData
   })

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
         fragmentMatcher,
         dataIdFromObject: (object: IdGetterObj & User) => {
            switch (object.__typename) {
               case 'User': {
                  return createUserDataId(object);
               }
               case 'MessageSenderType': return null; // sender.id breaks things
               default: return defaultDataIdFromObject(object);
            }
         }
      })
   });

   return client
}