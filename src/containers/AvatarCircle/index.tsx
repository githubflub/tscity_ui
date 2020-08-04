import React from 'react'
import classnames from 'classnames'
import default_user_img from 'assets/default_user_img.gif'
import { useGetSelfQuery } from 'apollo/hooks/useGetSelfQuery'
import './AvatarCircle.scss'

function AvatarCircle(props, ref) {
   const { className, ...other_props } = props;
   const avatar_circle_classname = classnames('avatar_circle', props.className)
   const { args, user } = useGetSelfQuery();

   return (
      <div ref={ref} className={avatar_circle_classname} {...other_props}>
         <img className="avatar_circle__img" src={default_user_img}/>
      </div>
   );
}

export default React.forwardRef(AvatarCircle)