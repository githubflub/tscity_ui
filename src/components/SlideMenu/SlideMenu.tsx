import React from 'react'
import classnames from 'classnames'
import './SlideMenu.scss'

function SlideMenu(props) {
   const {
      slide_direction,
      open,
      className,
      children,
      ...other_props
   } = props;

   const slide_menu_classname = classnames('slide_menu', className);

   let transform;
   if (open) {
      transform = 'translate3d(0, 0, 0)'
   }
   else {
      if (slide_direction === 'up') {
         transform = 'translate3d(0, 100%, 0)'
      }
      else if (slide_direction === 'left') {
         transform = 'translate3d(100%, 0, 0)'
      }
   }

   return (
      <div
         className={slide_menu_classname}
         {...other_props}
         style={{
            ...other_props.style,
            transform,
         }}
      >
         {children}
      </div>
   );
}

SlideMenu.defaultProps = {
   slide_direction: 'up',
   open: false,
}

export default SlideMenu