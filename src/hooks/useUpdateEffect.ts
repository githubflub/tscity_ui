import { useEffect, useRef } from 'react'

export function useUpdateEffect(effectFunction, arg) {
   const first_render = useRef(true)

   useEffect(() => {
      if (first_render.current) {
         first_render.current = false;
         return;
      }

      effectFunction()
   }, arg)
}