import {
   useQuery,
   useApolloClient,
   QueryHookOptions
} from 'apollo/apollo';
import { GET_USER_QUERY } from 'apollo/query/GET_USER_QUERY'
import { GetUserInputType } from '@tscity/shared/types/GetUserInputType'
import { UserFragments } from '@tscity/shared/graphql/fragments/UserFragment'
import { createUserDataId } from 'apollo/utils/createUserDataId'

export function useGetUserQuery(user_data: GetUserInputType) {
   const { username, id } = user_data;

   const options: QueryHookOptions = {
      skip: true,
      variables: {}
   }

   if (username) options.variables.username = username;
   else if (id) options.variables.id = id;

   const apollo_client = useApolloClient();
   let cached_user;
   if (username) {
      // Check apollo cache so we don't have to make
      // unnecessary request.
      try {
         const result = apollo_client.readFragment({
            id: createUserDataId({ username }),
            fragment: UserFragments.public
         })
         if (!result) throw new Error("User not in cache");
         else cached_user = result;
      }
      catch (error) {
         options.skip = false;
      }
   }

   const args = useQuery(GET_USER_QUERY, options);

   if (args.loading || cached_user) {
      args.data = {
         getUser: {
            id,
            username,
            // Should come last b/c id or username can be undefined
            ...cached_user,
         }
      }
   }

   const user = (args.data || {}).getUser

   return { args, user };
}