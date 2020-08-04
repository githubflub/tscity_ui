export const UPDATE_SEARCH = 'UPDATE_SEARCH'
export const SearchKeys = {
   profiles: 'profiles',
   messenger_hub: 'messenger_hub'
} as const

interface UpdateSearchAction {
   type: typeof UPDATE_SEARCH,
   payload: {
      key: keyof typeof SearchKeys;
      search: string;
   }
}

export function updateSearch(payload: UpdateSearchAction['payload']): UpdateSearchAction {
   return {
      type: UPDATE_SEARCH,
      payload,
   }
}

const initial_state = {}
Object.keys(SearchKeys).forEach(key => {
   initial_state[key] = '';
})

export default function searchReducer(state = initial_state, action: UpdateSearchAction = {} as UpdateSearchAction) {
   switch (action.type) {
      case UPDATE_SEARCH:
         return {
            ...state,
            [action.payload.key]: action.payload.search || ''
         }
      default:
         return state;
   }
}