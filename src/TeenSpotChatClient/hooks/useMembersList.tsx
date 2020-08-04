import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUserPopper } from 'redux_store/modules/chat'

export function useMembersList() {
   const { user_popper } = useSelector(state => state.chat)
   const dispatch = useDispatch();

   return {
      setUserPopper: (username?: string) => dispatch(setUserPopper(username)),
      user_popper,
   }
}