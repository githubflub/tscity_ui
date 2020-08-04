import React from 'react'
import {
   createStyles,
   withStyles,
   Theme,
} from '@material-ui/core'

import DialogContent from '@material-ui/core/DialogContent'

const ModalBody = withStyles((theme: Theme) => {
   console.log("theme", theme)
   return createStyles({
      root: {
         padding: '0px',
         display: 'flex',
      },
   })
})(DialogContent);

export default ModalBody