import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import { GET_LATEST_USERS } from 'apollo/query/GET_LATEST_USERS'
import { useQuery } from 'apollo/apollo'

export function useGetLatestUsersQuery() {
   const { blocklist } = useGetSelfQuery();
   const latest_users_args = useQuery(GET_LATEST_USERS);
   const latest_users = (latest_users_args.data || {}).getLatestUsers || []

   // ugh, filter.
   const filtered_latest_users = latest_users
      .filter(item => !blocklist.includes(item.id))

   return {
      latest_users_args,
      latest_users: filtered_latest_users,
   }
}