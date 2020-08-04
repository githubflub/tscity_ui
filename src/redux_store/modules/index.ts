import { combineReducers } from "redux";

// Import reducers
import chat from './chat'
import navbar from './navbar'
import session from './session'
import search from './search/search'
import profiles from './profiles/profiles'
import messenger from './messenger/messenger'

export default combineReducers({
   chat,
   navbar,
   search,
   session,
   profiles,
   messenger,
})
