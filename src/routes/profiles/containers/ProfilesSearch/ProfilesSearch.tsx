import React from 'react'
import './ProfilesSearch.scss'
import { SEARCH_USER } from 'apollo/query/SEARCH_USER'
import UserTile from 'containers/UserTile/UserTile'
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

                  {!!search_results.length && <React.Fragment>
                     <h1>{`Search Results`}</h1>
                     <div className="profiles_search__results">
                        {search_results.map((user, i) => <UserTile
                           key={i}
                           dark_mode
                           user={user}
                           use_internal_url
                           use_breakpoints
                           className="profiles_search__result"
                        />)}
                     </div>
                     <div style={{ minHeight: "60px" }} />
                  </React.Fragment>}

                  {!!latest_users.length && <React.Fragment>
                     <h1>{`Check out these folks!`}</h1>
                     <div className="profiles_search__results">
                        {latest_users.map((user, i) => <UserTile
                           key={i}
                           dark_mode
                           user={user}
                           use_internal_url
                           use_breakpoints
                           className="profiles_search__result"
                        />)}
                     </div>
                     <div style={{ minHeight: "60px" }} />
                  </React.Fragment>}

               </div>
            </ChatScrollContainer>
         </div>
      </div>
   )
}