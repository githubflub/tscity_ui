// I dunno if this is a good idea or not,
// but it creates a sort of interface layer
// that makes migrations easier, because
// I will only have to update imports here.

export {
   ApolloProvider,
   ApolloClient,
   ApolloLink,
   HttpLink,
   useQuery,
   QueryHookOptions,
   useApolloClient,
   useMutation,
   DataProxy,
   MutationHookOptions,
   useLazyQuery,
   QueryOptions,
} from '@apollo/client'
export {
   InMemoryCache,
   defaultDataIdFromObject,
   NormalizedCacheObject
} from '@apollo/client/cache';
export {
   onError
} from '@apollo/client/link/error';
export {
   setContext
} from '@apollo/client/link/context';



