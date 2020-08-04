import { UPDATE_THREAD_READ_TIME } from "apollo/mutation/UPDATE_THREAD_READ_TIME"
import { GET_SELF_QUERY } from "apollo/query/GET_SELF_QUERY"

export const SEND_OPEN_CONVERSATION_REQUEST = 'SEND_OPEN_CONVERSATION_REQUEST'
export const MESSENGER_OPEN_CONVERSATION = 'MESSENGER_OPEN_CONVERSATION'
export const MESSENGER_CLOSE_CONVERSATION = 'MESSENGER_CLOSE_CONVERSATION'
export const MESSENGER_UPGRADE_CONVERSATION = 'MESSENGER_UPGRADE_CONVERSATION'
export const MESSENGER_HUB_TOGGLE_SLIDER = 'MESSENGER_HUB_TOGGLE_SLIDER'
export const MESSENGER_TOGGLE_CONVERSATION_SLIDER = 'MESSENGER_TOGGLE_CONVERSATION_SLIDER'
export const MESSENGER_DEACTIVATE_CONVERSATION = 'MESSENGER_DEACTIVATE_CONVERSATION'
export const MESSENGER_HUB_SET_IS_OPEN = 'MESSENGER_HUB_SET_IS_OPEN'

type ConversationItemType = {
   target_user_id: number;
   target_username: string;
   thread_id?: number;
   is_open: boolean;
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


type MessengerActionTypes = (
   SendOpenConversationRequestAction
   | OpenConversationAction
   | CloseConversationAction
   | UpgradeConversationAction
   | ToggleMessengerHubSliderAction
   | ToggleConversationSliderAction
   | DeactivateConversationAction
   | MessengerHubSetIsOpenAction
)

export function sendOpenConversationRequestThunk(payload: SendOpenConversationRequestAction['payload']) {
   return (dispatch, getState, context) => {
      const { apollo_client } = context;
      const data = apollo_client.readQuery({ query: GET_SELF_QUERY })
      const { getMyDMs: dms } = data;

      for (let i = 0; i < dms.length; i++) {
         const dm = dms[i];
         if (dm.access_users.includes(payload.target_user_id)) {
            payload.thread_id = dm.id;
            break;
         }
      }

      dispatch(sendOpenConversationRequest(payload));
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

export function updateConversationReadTime(payload: ConversationItemType) {
   return (dispatch, getState, context) => {
      updateReadTime({ ...context, getState }, payload)
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

async function updateReadTime(tools, payload) {
   // console.log("UPDATING READ_TIME", payload);
   if (payload.thread_id) {
      const { apollo_client } = tools;
      const result = await apollo_client.mutate({
         mutation: UPDATE_THREAD_READ_TIME,
         variables: {
            thread_id: +payload.thread_id,
         }
      })

      // console.log("update_thread_read_time", result);
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
               ? action.payload
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
         return {
            ...state,
            active_conversation: null
         }
      }

      default:
         return state;
   }
}