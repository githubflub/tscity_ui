import { useState, useEffect } from 'react'
import { ResizeListener } from 'utils/ResizeListener';

function isMobile() {
   return window.innerWidth >= TABLET_SIZE? false : true
}

export function useIsMobile() {
   const initial_is_mobile = isMobile()
   const [is_mobile, setIsMobile] = useState(initial_is_mobile)

   useEffect(
      () => {
         const onWindowResize = () => {
            let current_is_mobile = isMobile()

            setIsMobile(() => current_is_mobile);
         }

         const subscription = ResizeListener.subscribe({
            onEvent: onWindowResize
         })

         return () => subscription.unsubscribe();
      },
      []
   )

   return is_mobile
}