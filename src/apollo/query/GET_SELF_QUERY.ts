import gql from 'graphql-tag'
import { UserFragments } from '@tscity/shared/graphql/fragments/UserFragment'
import { friend_request_fragments } from 'apollo/fragments/friend_request'
import { User } from 'lib/schema/user/typedef'
import { FriendRequest } from 'lib/schema/FriendRequest/typedef'
import { MessageFragment } from '@tscity/shared/graphql/fragments/MessageFragment'
import { Thread } from 'lib/schema/thread/typedef'


// Ugh this is so dumb.
export type GET_SELF_QUERY_TYPE = {
   getSelf: User
   getMyFriendRequests: FriendRequest[];
   getMySentFriendRequests: FriendRequest[];
   getMyDMs: Thread[];
   getMyBlockList: number[];
}

export const GET_SELF_QUERY = gql`
   query GetSelf {
      getSelf {
         ...UserOwner
      }

      getMyFriendRequests {
         ...FriendRequestGet
      }

      getMySentFriendRequests {
         ...FriendRequestGet
      }

      getMyDMs {
         id
         access_users
         last_read_time
         messages {
            ...MessageUser
         }
         users {
            ...UserPublic
         }
      }

      getMyBlockList
   }
   ${UserFragments.owner}
   ${friend_request_fragments.get}
   ${UserFragments.public}
   ${MessageFragment.user}
`