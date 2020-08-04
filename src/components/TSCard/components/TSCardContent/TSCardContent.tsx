import React from 'react';
import classnames from 'classnames'
import 'components/TSCard/TSCard.scss'

const TSCardContent: React.FC<any> = (props, ref) => {
   const { className, children, no_padding, ...other_props } = props

   const header_classname = classnames('tscard_content', className)
   let style = { padding: '10px' }
   if (no_padding) {
      style = { padding: '0px' }
   }
   return (
      <div
         ref={ref}
         className={header_classname}
         {...other_props}
         style={{ ...style, ...other_props.style }}
      >
         {children}
      </div>
   )
}

export default TSCardContent;
