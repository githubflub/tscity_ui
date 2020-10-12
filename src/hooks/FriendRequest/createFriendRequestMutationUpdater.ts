import { FriendRequest } from 'lib/schema/FriendRequest/typedef'
import { DataProxy } from 'apollo/apollo'
import { GET_SELF_QUERY, GET_SELF_QUERY_TYPE } from 'apollo/query/GET_SELF_QUERY'
import { KeyOfMatchingType } from '@tscity/shared/types/KeyOfMatchingType'


export const createFriendRequestMutationUpdater = (
   function_name: string,
   data_name: KeyOfMatchingType<GET_SELF_QUERY_TYPE, FriendRequest[]>,
   action: keyof []
) => (
   cache: DataProxy,
   { data: dumb }
) => {
   // console.log("function_name", function_name)
   // console.log("data_name", data_name);
   // console.log("dumb", dumb);
   const { [function_name]: friend_request } = dumb;
   const data = cache.readQuery<GET_SELF_QUERY_TYPE>({ query: GET_SELF_QUERY });
   const { [data_name]: friend_request_array } = data;
   // console.log(data_name, friend_request_array);
   // console.log("friend_request", friend_request)

   cache.writeQuery({
      query: GET_SELF_QUERY,
      data: {
         ...data,
         [data_name]: (
            action === 'filter'? friend_request_array.filter(request => !(request.id === friend_request.id))
            : (action === 'unshift' && !friend_request_array.find(item => item.id === friend_request.id))?
               [ friend_request, ...friend_request_array ]
            : friend_request_array
         )
      },
   });
}