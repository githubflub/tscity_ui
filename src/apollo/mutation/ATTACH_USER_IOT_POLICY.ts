import gql from 'graphql-tag'

export const ATTACH_USER_IOT_POLICY = gql`
   mutation AttachUserIoTPolicy($identity_id: String!) {
      attachUserIoTPolicy(identity_id: $identity_id)
   }
`