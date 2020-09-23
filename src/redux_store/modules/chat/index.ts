import { WELCOME_MESSAGE } from './welcome_message'

export const TSCC_JOIN_ROOMS = 'TSCC_JOIN_ROOMS'
export const TSCC_LEAVE_ROOMS = 'TSCC_LEAVE_ROOMS'
export const TSCC_TOGGLE_NON_CHAT_ROOM = 'TSCC_TOGGLE_NON_CHAT_ROOM'
export const TSCC_OPEN_NON_CHAT_ROOM = 'TSCC_OPEN_NON_CHAT_ROOM'
export const TSCC_CLOSE_NON_CHAT_ROOM = 'TSCC_CLOSE_NON_CHAT_ROOM'
export const TSCC_RESET_MESSAGES_BEFORE_CHAT_DATA = 'TSCC_RESET_MESSAGES_BEFORE_CHAT_DATA'
export const TSCC_SET_USER_POPPER = 'TSCC_SET_USER_POPPER'
export const TSCC_UPDATE_CURRENT_INPUT_VALUE_ACTION = 'TSCC_UPDATE_CURRENT_INPUT_VALUE_ACTION'

export const TSCC_ADD_MESSAGES_BEFORE_CHAT_DATA = 'TSCC_ADD_MESSAGES_BEFORE_CHAT_DATA'

export const USERS_SLIDE_MENU = 'Users'
export const ROOMS_SLIDE_MENU = 'Rooms'

const non_chat_room_names_array = [USERS_SLIDE_MENU, ROOMS_SLIDE_MENU];

export interface JoinRoomsPayloadType {
   thread_ids: string[];
   current_room?: string;
}

export type NonChatRoomNamesType = typeof USERS_SLIDE_MENU | typeof ROOMS_SLIDE_MENU;

interface JoinRoomsAction {
   type: typeof TSCC_JOIN_ROOMS,
   payload: JoinRoomsPayloadType
}

interface LeaveRoomsAction {
   type: typeof TSCC_LEAVE_ROOMS,
   payload: JoinRoomsPayloadType
}

interface OpenNonChatRoomAction {
   type: typeof TSCC_OPEN_NON_CHAT_ROOM,
   payload: {
      name: NonChatRoomNamesType
   }
}

interface ToggleNonChatRoomAction {
   type: typeof TSCC_TOGGLE_NON_CHAT_ROOM,
   payload: {
      name: NonChatRoomNamesType
   }
}

interface CloseNonChatRoomAction {
   type: typeof TSCC_CLOSE_NON_CHAT_ROOM
}

interface AddMessagesBeforeChatDataAction {
   type: typeof TSCC_ADD_MESSAGES_BEFORE_CHAT_DATA,
   payload: {
      messages: any[]
   }
}

interface ResetMessagesBeforeChatDataAction {
   type: typeof TSCC_RESET_MESSAGES_BEFORE_CHAT_DATA,
}

interface SetUserPopperAction {
   type: typeof TSCC_SET_USER_POPPER,
   payload: {
      username: string;
   }
}

interface ChatUpdateCurrentInputValueAction {
   type: typeof TSCC_UPDATE_CURRENT_INPUT_VALUE_ACTION,
   payload: {
      current_input_value: string;
   }
}

export type ChatActionTypes = (
   ToggleNonChatRoomAction
   | OpenNonChatRoomAction
   | CloseNonChatRoomAction
   | AddMessagesBeforeChatDataAction
   | ResetMessagesBeforeChatDataAction
   | SetUserPopperAction
   | LeaveRoomsAction
   | JoinRoomsAction
   | ChatUpdateCurrentInputValueAction
);

export function updateCurrentInputValue(payload: ChatUpdateCurrentInputValueAction['payload']): ChatActionTypes {
   return {
      type: TSCC_UPDATE_CURRENT_INPUT_VALUE_ACTION,
      payload,
   }
}

export function joinRooms(payload: JoinRoomsPayloadType) {
   return async (dispatch) => {
      return dispatch({
         type: TSCC_JOIN_ROOMS,
         payload,
      })
   }
}

export function leaveRooms(payload: JoinRoomsPayloadType) {
   return async (dispatch) => {
      return dispatch({
         type: TSCC_LEAVE_ROOMS,
         payload
      })
   }
}

export function toggleNonChatRoom(payload: ToggleNonChatRoomAction['payload']): ChatActionTypes {
   return {
      type: TSCC_TOGGLE_NON_CHAT_ROOM,
      payload,
   }
}

export function openNonChatRoom(payload: OpenNonChatRoomAction['payload']): ChatActionTypes {
   return {
      type: TSCC_OPEN_NON_CHAT_ROOM,
      payload,
   }
}

export function closeNonChatRoom(): ChatActionTypes {
   return {
      type: TSCC_CLOSE_NON_CHAT_ROOM,
   }
}

export function addMessagesBeforeChatData(messages: [] = []): ChatActionTypes {
   const payload: AddMessagesBeforeChatDataAction['payload'] = {
      messages
   }

   return {
      type: TSCC_ADD_MESSAGES_BEFORE_CHAT_DATA,
      payload
   }
}

export function resetMessagesBeforeChatData(): ChatActionTypes {
   return {
      type: TSCC_RESET_MESSAGES_BEFORE_CHAT_DATA,
   }
}

export function setUserPopper(username): ChatActionTypes {
   const payload: SetUserPopperAction['payload'] = { username }

   return {
      type: TSCC_SET_USER_POPPER,
      payload,
   }
}



export interface ChatStateType {
   current_room: string;
   non_chat_room_is_open: boolean;
   selected_non_chat_room: string;
   open_rooms: string[];
   user_popper: string;
   current_input_value: string;
   messages_before_chat_data: ({
      id: number,
      content: string;
      system_message?: boolean
   })[];
}

const initial_state: ChatStateType = {
   current_room: undefined,
   non_chat_room_is_open: false,
   selected_non_chat_room: undefined,
   open_rooms: [],

   // Used for preserving input value when
   // switching GUIs (like going from twitch to classic)
   current_input_value: '',

   // When someone clicks a user in
   // the users list, a popper opens.
   user_popper: '',

   // I do something stupid perhaps.
   // I store chat messages in a structure from
   // the response of an API request. However, there
   // may be times when I want to add some messages
   // before the API request is complete, before the
   // data structure is available to write in.
   // In that case, I guess I'll just dump those messages
   // here... u_u
   messages_before_chat_data: [
      {
         id: 0,
         content: WELCOME_MESSAGE,
         system_message: true,
      }
   ],
}

export default function chatReducer(state = initial_state, action: ChatActionTypes = {} as ChatActionTypes): ChatStateType {
   let new_state, new_open_rooms, new_current_room;
   let name, error, selected_non_chat_room, non_chat_room_is_open;

   switch (action.type) {
      case TSCC_UPDATE_CURRENT_INPUT_VALUE_ACTION: {
         return {
            ...state,
            current_input_value: typeof action.payload.current_input_value === 'string'
               ? action.payload.current_input_value
               : ''
         }
      }
      case TSCC_OPEN_NON_CHAT_ROOM:
         return {
            ...state,
            non_chat_room_is_open: true,
            selected_non_chat_room: action.payload.name || state.selected_non_chat_room
         }
      case TSCC_CLOSE_NON_CHAT_ROOM:
         return {
            ...state,
            non_chat_room_is_open: false,
         }
      case TSCC_TOGGLE_NON_CHAT_ROOM:
         error = false
         name = action.payload.name;
         selected_non_chat_room = state.selected_non_chat_room
         non_chat_room_is_open = state.non_chat_room_is_open

         if (non_chat_room_names_array.includes(name)) {
            selected_non_chat_room = name
         }
         else {
            error = true
         }

         if (!error) {
            if (state.non_chat_room_is_open) {
               if (state.selected_non_chat_room === name) {
                  non_chat_room_is_open = false
               }
               else {
                  non_chat_room_is_open = true
               }
            }
            else {
               non_chat_room_is_open = true
            }
         }

         return {
            ...state,
            selected_non_chat_room,
            non_chat_room_is_open,
         };

      case TSCC_JOIN_ROOMS:
         new_open_rooms = state.open_rooms.concat(action.payload.thread_ids)
         new_current_room = action.payload.current_room; // Might be undefined and that's ok

         if (new_current_room && new_current_room !== 'rooms') {
            new_open_rooms.push(new_current_room)
         }
         new_open_rooms = [ ...new Set(new_open_rooms) ];
         new_state = {
            ...state,
            open_rooms: new_open_rooms,
            non_chat_room_is_open: false,
         }

         if (new_current_room) {
            new_state.current_room = new_current_room
         }
         return new_state;

      case TSCC_LEAVE_ROOMS:
         new_current_room = state.current_room;
         new_open_rooms = [ ...state.open_rooms ];

         action.payload.thread_ids.forEach(room_id => {
            if (new_open_rooms.length > 1) {
               const index = new_open_rooms.indexOf(room_id)
               if (index > -1) {
                  new_open_rooms.splice(index, 1);

                  // Set new current_room
                  if (index === 0) {
                     new_current_room = new_open_rooms[new_open_rooms.length - 1]
                  }
                  else {
                     new_current_room = new_open_rooms[index - 1];
                  }
               }
            }
         })

         return {
            ...state,
            open_rooms: new_open_rooms,
            current_room: new_current_room
         }



      case TSCC_ADD_MESSAGES_BEFORE_CHAT_DATA:
         return {
            ...state,
            messages_before_chat_data: state.messages_before_chat_data.concat(action.payload.messages)
         }
      case TSCC_RESET_MESSAGES_BEFORE_CHAT_DATA:
         return {
            ...state,
            messages_before_chat_data: []
         }
      case TSCC_SET_USER_POPPER:
         return {
            ...state,
            user_popper: action.payload.username
         }
      default:
         return state;
   }
}