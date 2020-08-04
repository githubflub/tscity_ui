import { useState, useEffect } from 'react'
import { ResizeListener } from 'utils/ResizeListener'

export function useScreenSize() {
   const [screen_width, setScreenWidth] = useState(window.innerWidth)
   const [screen_height, setScreenHeight] = useState(window.innerHeight)

   useEffect(
      () => {
         const handleResize = () => {
            setScreenWidth(window.innerWidth)
            setScreenHeight(window.innerHeight)
         }

         const subscription = ResizeListener.subscribe({
            onEvent: handleResize,
         })

         return () => subscription.unsubscribe();
      },
      []
   )

   return [screen_width, screen_height]
}