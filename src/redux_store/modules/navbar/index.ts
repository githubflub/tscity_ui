import { SyntheticEvent } from "react";
import {
   SEND_OPEN_CONVERSATION_REQUEST,
   SendOpenConversationRequestAction
} from '../messenger/messenger'

export const OPEN_NAVBAR_MENU = 'OPEN_NAVBAR_MENU';
export const CLOSE_NAVBAR_MENU = 'CLOSE_NAVBAR_MENU';
export const NAVBAR_SET_IS_DIALOG_OPEN = 'NAVBAR_SET_IS_DIALOG_OPEN'

interface CloseNavbarMenuAction {
   type: typeof CLOSE_NAVBAR_MENU,
   payload: {
      event: SyntheticEvent;
   }
}

interface OpenNavbarMenuAction {
   type: typeof OPEN_NAVBAR_MENU,
   payload: {
      name: string;
   }
}

interface SetIsDialogOpenAction {
   type: typeof NAVBAR_SET_IS_DIALOG_OPEN,
   payload: boolean;
}

export type NavbarActionTypes = (
   CloseNavbarMenuAction
   | OpenNavbarMenuAction
   | SetIsDialogOpenAction
   | SendOpenConversationRequestAction
);

export function closeNavbarMenu(payload?: CloseNavbarMenuAction['payload']): NavbarActionTypes {
   return {
      type: CLOSE_NAVBAR_MENU,
      payload: {
         ...payload,
      }
   }
}

export function openNavbarMenu(payload: OpenNavbarMenuAction['payload']): NavbarActionTypes {
   return {
      type: OPEN_NAVBAR_MENU,
      payload,
   }
}

export function setIsDialogOpen(payload: SetIsDialogOpenAction['payload']): NavbarActionTypes {
   return {
      type: NAVBAR_SET_IS_DIALOG_OPEN,
      payload,
   }
}

const initial_state = {
   open_menu_name: '',
   is_dialog_open: false,
}

export default function navbarReducer(state = initial_state, action: NavbarActionTypes = {} as NavbarActionTypes) {
   switch (action.type) {
      case SEND_OPEN_CONVERSATION_REQUEST: {
         if (window.innerWidth < TABLET_SIZE) {
            return {
               ...state,
               open_menu_name: 'MessengerMenu',
            }
         }

         return state;
      }
      case NAVBAR_SET_IS_DIALOG_OPEN: {
         return {
            ...state,
            is_dialog_open: action.payload
         }
      }
      case OPEN_NAVBAR_MENU:
         return {
            ...state,
            open_menu_name: state.open_menu_name === action.payload.name? '' : action.payload.name
         }
      case CLOSE_NAVBAR_MENU: {
         let dont_do_it = false;

         if (action.payload.event) {
            const buttons = [
               'user_menu_button',
               'notifications_menu_button',
               'messenger_menu_button'
            ]

            // console.log("go...")
            // console.dir(action.payload.event.target)

            let cancer = null
            for (let i = 0; i < buttons.length; i++) {
               const button_name = buttons[i];
               cancer = document.getElementById(button_name)
               // console.dir(cancer);
               if (cancer && cancer.contains(action.payload.event.target)) {
                  dont_do_it = true
               }
            }
         }

         if (dont_do_it) {
            return state;
         }

         return {
            ...state,
            open_menu_name: ''
         }
      }
      default:
         return state;
   }
}