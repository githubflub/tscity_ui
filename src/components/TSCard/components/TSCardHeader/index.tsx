import React from 'react'
import {
   createStyles,
   withStyles,
   Theme,
} from '@material-ui/core'
import classnames from 'classnames'

function TSCardHeaderRender(props) {
   const { className, classes, children, ...other_props } = props

   const header_classname = classnames(classes.root, className)

   return (
      <div className={header_classname} {...other_props}>
         {children}
      </div>
   )
}

const TSCardHeader = withStyles((theme: Theme) => {
   return createStyles({
      root: {
         padding: '10px',
         color: '#FFF',
         position: 'relative'
      }
   })
})(TSCardHeaderRender)

TSCardHeader.displayName = 'TSCardHeader'

export default TSCardHeader