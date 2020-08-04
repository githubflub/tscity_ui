import React, { useEffect } from 'react'
import { useScreenSize } from 'hooks/useScreenSize'
import { useUpdateEffect } from 'hooks/useUpdateEffect'
import { usePrevious } from 'hooks/usePrevious'

const ELEMENT_ID = 'ts_signup_grecaptcha'
const empty_grecaptcha = { render: () => {} }

export default function GreCaptcha(props) {
   const { onGreCaptchaCallback, ...div_props } = props
   const [screen_width] = useScreenSize();
   const previous_screen_width = usePrevious(screen_width)

   const renderGreCaptcha = () => {
      const grecaptcha = window && window.grecaptcha || empty_grecaptcha;

      const grecaptcha_render_params = {
         sitekey: RECAPTCHA_SITE_KEY,
         callback: onGreCaptchaCallback,
         theme: 'dark',
      }

      grecaptcha.render(ELEMENT_ID, grecaptcha_render_params);
   }

   useEffect(renderGreCaptcha, [])
   // useUpdateEffect(() => {
   //    if (previous_screen_width < MOBILE_SIZE && screen_width >= MOBILE_SIZE) {
   //       renderGreCaptcha();
   //    }
   //    else if (previous_screen_width >= MOBILE_SIZE && screen_width < MOBILE_SIZE) {
   //       renderGreCaptcha();
   //    }
   // }, [screen_width, previous_screen_width])

   return (
      <div
         data-size={screen_width > MOBILE_SIZE? 'compact' : 'compact'}
         {...div_props}
         style={{
            margin: 'auto',
            marginBottom: '15px',
            ...div_props.style,
         }}
         id={ELEMENT_ID}
      />
   )
}
