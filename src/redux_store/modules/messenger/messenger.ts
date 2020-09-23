import axios from 'axios';
import { GET_SELF_QUERY } from "apollo/query/GET_SELF_QUERY"
import { getGraphQlEndpoint } from 'utils/getEndpoint'

export const SEND_OPEN_CONVERSATION_REQUEST = 'SEND_OPEN_CONVERSATION_REQUEST'
export const MESSENGER_OPEN_CONVERSATION = 'MESSENGER_OPEN_CONVERSATION'
export const MESSENGER_CLOSE_CONVERSATION = 'MESSENGER_CLOSE_CONVERSATION'
export const MESSENGER_UPGRADE_CONVERSATION = 'MESSENGER_UPGRADE_CONVERSATION'
export const MESSENGER_HUB_TOGGLE_SLIDER = 'MESSENGER_HUB_TOGGLE_SLIDER'
export const MESSENGER_TOGGLE_CONVERSATION_SLIDER = 'MESSENGER_TOGGLE_CONVERSATION_SLIDER'
export const MESSENGER_DEACTIVATE_CONVERSATION = 'MESSENGER_DEACTIVATE_CONVERSATION'
export const MESSENGER_HUB_SET_IS_OPEN = 'MESSENGER_HUB_SET_IS_OPEN'
export const MESSENGER_UPDATE_CURRENT_INPUT = 'MESSENGER_UPDATE_CURRENT_INPUT'

type ConversationItemType = {
   target_user_id: number;
   target_username: string;
   thread_id?: number;
   is_open: boolean;
   sender_user_id?: number;
   sender_username?: string;
   current_input_value?: string;
}

export interface SendOpenConversationRequestAction {
   type: typeof SEND_OPEN_CONVERSATION_REQUEST,
   payload: ConversationItemType
}

interface OpenConversationAction {
   type: typeof MESSENGER_OPEN_CONVERSATION,
   payload: ConversationItemType
}

interface CloseConversationAction {
   type: typeof MESSENGER_CLOSE_CONVERSATION,
   payload: ConversationItemType
}

interface UpgradeConversationAction {
   type: typeof MESSENGER_UPGRADE_CONVERSATION,
   payload: ConversationItemType
}

interface MessengerHubSetIsOpenAction {
   type: typeof MESSENGER_HUB_SET_IS_OPEN,
   payload: boolean;
}

interface ToggleMessengerHubSliderAction {
   type: typeof MESSENGER_HUB_TOGGLE_SLIDER
}

interface ToggleConversationSliderAction {
   type: typeof MESSENGER_TOGGLE_CONVERSATION_SLIDER;
   payload: ConversationItemType;
}

interface DeactivateConversationAction {
   type: typeof MESSENGER_DEACTIVATE_CONVERSATION;
}

interface UpdateCurrentInputValueAction {
   type: typeof MESSENGER_UPDATE_CURRENT_INPUT;
   payload: ConversationItemType;
}


type MessengerActionTypes = (
   SendOpenConversationRequestAction
   | OpenConversationAction
   | CloseConversationAction
   | UpgradeConversationAction
   | ToggleMessengerHubSliderAction
   | ToggleConversationSliderAction
   | DeactivateConversationAction
   | MessengerHubSetIsOpenAction
   | UpdateCurrentInputValueAction
)

export function sendOpenConversationRequestThunk(payload: SendOpenConversationRequestAction['payload']) {
   return (dispatch, getState, context) => {
      const { apollo_client } = context;
      const data = apollo_client.readQuery({ query: GET_SELF_QUERY })
      const { getMyDMs: dms } = data;

      if (!payload.sender_user_id && payload.sender_user_id !== 0) {
         console.error("You need to pass sender_user_id.");
      }

      for (let i = 0; i < dms.length; i++) {
         const dm = dms[i];
         const access_users = dm.access_users.slice() as number[];

         // console.log("access_users 1", JSON.stringify(access_users))

         // Special case. Be mindful of self-DMs.
         if (
            access_users.length === 1 // indicates self DM
            && payload.target_user_id !== payload.sender_user_id
         ) {
            // We're not looking for a self DM, so pass.
            continue
         }

         const index_target = access_users.indexOf(payload.target_user_id)
         if (index_target > -1) {
            access_users.splice(index_target, 1);
         }

         // console.log("access_users 2", JSON.stringify(access_users))

         const index_sender = access_users.indexOf(payload.sender_user_id)
         if (index_sender > -1) {
            access_users.splice(index_sender, 1);
         }

         // console.log("access_users 3", JSON.stringify(access_users))

         if (!access_users.length) {
            payload.thread_id = dm.id;
            break;
         }
      }

      dispatch(sendOpenConversationRequest(payload));
   }
}

export function updateCurrentInputValue(payload: UpdateCurrentInputValueAction['payload']): MessengerActionTypes {
   return {
      type: MESSENGER_UPDATE_CURRENT_INPUT,
      payload
   }
}

export function sendOpenConversationRequest(payload: SendOpenConversationRequestAction['payload']): MessengerActionTypes {
   return {
      type: SEND_OPEN_CONVERSATION_REQUEST,
      payload,
   }
}

export function openConversation(payload: OpenConversationAction['payload']): MessengerActionTypes {
   return {
      type: MESSENGER_OPEN_CONVERSATION,
      payload,
   }
}

export function updateConversationLocalReadTime(payload: ConversationItemType) {
   return (dispatch, getState, context) => {
      updateLocalReadTime({ ...context, getState }, payload);
   }
}

function updateLocalReadTime(tools, payload) {
   // console.log("UPDATING LOCAL READ TIME", payload);
   if (payload.thread_id || +payload.thread_id === 0) {
      // Only update if conversation is open!
      let should_update = false;
      const state = tools.getState();
      const msg_state = state.messenger;
      const nav_state = state.navbar;

      if (window.innerWidth < TABLET_SIZE) {
         should_update = (
            nav_state.open_menu_name === 'MessengerMenu'
            && msg_state.active_conversation
            && msg_state.active_conversation.target_user_id === payload.target_user_id
            && msg_state.active_conversation.target_username === payload.target_username
         )
      }
      else {
         const convo = msg_state.open_conversations.find(item => (
            item.target_user_id === payload.target_user_id
            && item.target_username === payload.target_username
            && item.is_open
         ))

         should_update = !!convo
      }


      if (should_update) {
         // console.log("Yes, should update!");
         const { apollo_client } = tools;
         const data = apollo_client.readQuery({ query: GET_SELF_QUERY })

         const thread_id = payload.thread_id;

         apollo_client.writeQuery({
            query: GET_SELF_QUERY,
            data: {
               ...data,
               getMyDMs: data.getMyDMs
                  .map(item => {
                     if (+item.id !== +thread_id) return item;

                     return {
                        ...item,
                        last_read_time: (new Date()).toISOString()
                     }
                  }),
            }
         })
      }
      else {
         // console.log("Nope! Should NOT update!");
      }
   }
}

export async function updateReadTimeAxios(tools, payload) {
   // console.log("UPDATING READ_TIME WITH AXIOS", payload);
   if (payload.thread_id) {
      const { identity_token } = tools;
      try {
         const endpoint = getGraphQlEndpoint();

         // This is really stupid, but I can't make
         // this request using apollo_client during a
         // page refresh. It throws a "Network failed to
         // fetch" error, so I am using axios instead.
         // This works, but it's also really bad, because
         // I can't just have random queries like this
         // floating in the ether.
         //
         const result = await axios
            .post(endpoint, {
                  operationName: "UpdateThreadReadTime",
                  query: `mutation UpdateThreadReadTime($thread_id: Int!) {
                     updateThreadReadTime(thread_id: $thread_id) {
                        thread_id
                        user_id
                        timestamp
                         __typename
                     }
                  }`,
                  variables: {
                     thread_id: +payload.thread_id,
                  }
               },
               {
                  headers: {
                     authorization: identity_token,
                  }
               }
            )

         // console.log("update_thread_read_time", result);
      }
      catch (error) {
         // console.log("updateReadTime failed", error);
      }
   }
   else {
      // console.log("updateReadTime item did not have thread_id");
   }
}

export function closeConversation(payload: CloseConversationAction['payload']): MessengerActionTypes {
   return {
      type: MESSENGER_CLOSE_CONVERSATION,
      payload,
   }
}

export function upgradeConversation(payload: UpgradeConversationAction['payload']): MessengerActionTypes {
   return {
      type: MESSENGER_UPGRADE_CONVERSATION,
      payload,
   }
}

export function setMessengerHubIsOpen(payload: MessengerHubSetIsOpenAction['payload']): MessengerActionTypes {
   return {
      type: MESSENGER_HUB_SET_IS_OPEN,
      payload,
   }
}

export function toggleMessengerHubSlider(): MessengerActionTypes {
   return {
      type: MESSENGER_HUB_TOGGLE_SLIDER
   }
}

export function toggleConversationSlider(payload: ToggleConversationSliderAction['payload']): MessengerActionTypes {
   return {
      type: MESSENGER_TOGGLE_CONVERSATION_SLIDER,
      payload,
   }
}

export function deactivateConversation(): MessengerActionTypes {
   return {
      type: MESSENGER_DEACTIVATE_CONVERSATION,
   }
}


const initial_state = {
   is_messenger_hub_open: false,
   open_conversations: [],
   active_conversation: null,
}

export default function messengerReducer(state = initial_state, action: MessengerActionTypes = {} as MessengerActionTypes) {
   switch (action.type) {
      case MESSENGER_UPDATE_CURRENT_INPUT: {
         const { target_user_id, target_username, current_input_value } = action.payload;
         const active_conversation = state.active_conversation

         return {
            ...state,
            active_conversation: active_conversation.target_user_id === target_user_id && active_conversation.target_username === target_username
               ? {
                  ...active_conversation,
                  current_input_value,
               }
               : active_conversation,
            open_conversations: state.open_conversations
               .map((item, i) => {
                  if (
                     item.target_user_id === target_user_id
                     && item.target_username === target_username
                  ) {
                     return {
                        ...item,
                        current_input_value
                     }
                  }

                  return item;
               })
         };
      }

      case SEND_OPEN_CONVERSATION_REQUEST:
      case MESSENGER_OPEN_CONVERSATION: {
         const { thread_id, target_user_id, target_username } = action.payload;

         const index = state.open_conversations.findIndex(item => (
            item.target_user_id === target_user_id
            && item.target_username === target_username
         ))

         return {
            ...state,
            active_conversation: index < 0
               ? {
                   ...action.payload,
                   remove_from_open_conversations_on_close: window.innerWidth < TABLET_SIZE? true : false
               }
               : {
                  ...state.open_conversations[index],
                  ...action.payload,
               },
            open_conversations: index < 0
               ? state.open_conversations.concat(action.payload)
               : state.open_conversations
                  .map((item, i) => {
                     if (index === i) {
                        return {
                           ...item,
                           ...action.payload,
                        }
                     }

                     return item;
                  })
         }
      }
      case MESSENGER_CLOSE_CONVERSATION: {
         const { thread_id, target_user_id, target_username } = action.payload;

         const change_active = (
            state.active_conversation
            && state.active_conversation.target_user_id === target_user_id
            && state.active_conversation.target_username === target_username
         );

         return {
            ...state,
            active_conversation: change_active? null : state.active_conversation,
            open_conversations: state.open_conversations
               .filter(item => !(
                  item.thread_id === thread_id
                  && item.target_user_id === target_user_id
                  && item.target_username === target_username
               ))
         }
      }
      case MESSENGER_UPGRADE_CONVERSATION: {
         const { thread_id, target_user_id, target_username } = action.payload;
         let change = false;
         let new_active_conversation;
         const new_array = state.open_conversations.map(item => {
            if (
               item.target_user_id === target_user_id
               && item.target_username === target_username
               && !item.thread_id
            ) {
               change = true;

               if (
                  state.active_conversation
                  && state.active_conversation.target_user_id === target_user_id
                  && state.active_conversation.target_username === target_username
               ) {
                  new_active_conversation = {
                     ...state.active_conversation,
                     thread_id
                  }
               }

               return {
                  ...item,
                  thread_id
               }
            }

            return item;
         })



         return {
            ...state,
            active_conversation: new_active_conversation || state.active_conversation,
            open_conversations: change? new_array : state.open_conversations
         }
      }
      case MESSENGER_HUB_SET_IS_OPEN: {
         return {
            ...state,
            is_messenger_hub_open: action.payload || false,
         }
      }
      case MESSENGER_HUB_TOGGLE_SLIDER: {
         return {
            ...state,
            is_messenger_hub_open: !state.is_messenger_hub_open
         }
      }
      case MESSENGER_TOGGLE_CONVERSATION_SLIDER: {
         const { thread_id, target_user_id, target_username } = action.payload
         let change = false;
         const new_array = state.open_conversations
            .map(item => {
               if (
                  item.target_user_id === target_user_id
                  && item.target_username === target_username
               ) {
                  change = true;
                  return {
                     ...item,
                     is_open: !item.is_open,
                  }
               }

               return item;
            })

         return {
            ...state,
            open_conversations: change? new_array : state.open_conversations

         }
      }
      case MESSENGER_DEACTIVATE_CONVERSATION: {
         const active_conversation = state.active_conversation
         // console.log("active_conversation", active_conversation);
         return {
            ...state,
            active_conversation: null,
            open_conversations: (active_conversation && active_conversation.remove_from_open_conversations_on_close)
               ? state.open_conversations
                  .filter(item => {
                     if (
                        item.target_user_id === active_conversation.target_user_id
                        && item.target_username === active_conversation.target_username
                     ) {
                        return false
                     }

                     return true
                  })
               : state.open_conversations,
         }
      }

      default:
         return state;
   }
}