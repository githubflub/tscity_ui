import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import './ProfilesSearch.scss'
import { SEARCH_USER } from 'apollo/query/SEARCH_USER'
import UserTile from 'containers/UserTile/UserTile'
import { GET_LATEST_USERS } from 'apollo/query/GET_LATEST_USERS'
import ChatScrollContainer from 'TeenSpotChatClient/gui/shared/ChatScrollContainer/ChatScrollContainer'
import { useSearch } from 'hooks/useSearch'
import { SearchKeys } from 'redux_store/modules/search/search'
import { useHistory } from 'react-router-dom'
import { useGetLatestUsersQuery } from 'apollo/hooks/useGetLatestUsersQuery'

export default function ProfileSearch(props) {
   const history = useHistory();
   const { SearchForm, search_results } = useSearch({
      query: SEARCH_USER,
      search_key: SearchKeys.profiles,
      query_result_key: 'searchUsers',
      onFeelingLucky: search_term => history.push(`/profiles/${search_term}`),
      show_submit_button: true,
      placeholder: "Search for a profile..."
   })

   const { latest_users } = useGetLatestUsersQuery()

   return (
      <div className="teenspot_app_layout__page">
         <div className="teenspot_app_layout__page_container_free">
            <div className="ts_app_layout__section">
               {SearchForm}
            </div>
            <ChatScrollContainer no_stick hidden>
               <div className="ts_app_layout__section" style={{ margin: 'auto' }}>
                  {!!search_results.length && <div className="profiles_search__results">
                     <h2>{`Search Results`}</h2>
                     {search_results.map((user, i) => <UserTile key={i} user={user} use_internal_url />)}
                  </div>}
                  {!!latest_users.length && <div className="profiles_search__results">
                     <h2>{`Check out these folks!`}</h2>
                     {latest_users.map((user, i) => <UserTile key={i} user={user} use_internal_url style={{ height: '195px' }} />)}
                  </div>}
               </div>
            </ChatScrollContainer>
         </div>
      </div>
   )
}