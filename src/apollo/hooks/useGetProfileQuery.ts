import { GET_PROFILE_QUERY } from 'apollo/query/get_profile'
import { useQuery } from 'apollo/apollo'
import { useSelector } from 'react-redux'

export function useGetProfileQuery(username?) {
   const { identity } = useSelector(state => state.session);

   const options = {
      variables: {
         username: identity && identity['cognito:username'] === username? undefined : username
      }
   }

   const args = useQuery(GET_PROFILE_QUERY, options)
   const profile = (args.data || {}).getProfile

   return [args, profile]
}