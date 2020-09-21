import React from 'react'
import classnames from 'classnames'
import default_user_img from 'assets/default_user_img.gif'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import './AvatarCircle.scss'

function AvatarCirclePrivate(props, ref) {
   const {
      className,
      size,
      style,
      ...other_props
   } = props;
   const avatar_circle_classname = classnames('avatar_circle', props.className)

   const internal_style = {
      minWidth: size,
      height: size,
      width: size,
   }

   return (
      <div
         ref={ref}
         className={avatar_circle_classname}
         {...other_props}
         style={{
            ...internal_style,
            style
         }}
      >
         <img
            className="avatar_circle__img"
            src={default_user_img}
         />
      </div>
   );
}

const AvatarCircle = React.forwardRef(AvatarCirclePrivate)

AvatarCircle.defaultProps = {
   size: 40
}


export default AvatarCircle;