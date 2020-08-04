import React from 'react'
import {
   createStyles,
   withStyles,
   Theme,
} from '@material-ui/core'
import { fade } from '@material-ui/core/styles/colorManipulator';
import InputBase from '@material-ui/core/InputBase';

const BootstrapInput = withStyles((theme: Theme) => {
   // console.log("theme", theme)
   return createStyles({
      root: {
         width: '100%',
         'label + &': {
            // marginTop: theme.spacing(3),
         },
      },
      input: {
         borderRadius: 4,
         backgroundColor: theme.palette.common.white,
         border: '1px solid #ccc',
         width: '100%',
         padding: '6px 12px',
         height: '34px',
         fontSize: '14px',
         boxSizing: 'border-box',
         lineHeight: `${20 / 14}`,
         transition: theme.transitions.create(['border-color', 'box-shadow']),
         // Use the system font instead of the default Roboto font.
         fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
         ].join(','),
         '&:focus': {
            boxShadow: `inset 0px 1px 1px rgba(0,0,0,0.075), 0px 0px 8px ${fade(theme.palette.primary.main, 0.6)}`,
            borderColor: theme.palette.primary.main,
         },
      },
      error: {
         '& input': {
            border: `1px solid ${theme.palette.error.main}`,
            '&:focus': {
               boxShadow: `inset 0px 1px 1px rgba(0,0,0,0.075), 0px 0px 8px ${fade(theme.palette.error.main, 0.6)}`,
               borderColor: theme.palette.error.main,
            },
         }
      }
   })
})(InputBase);

BootstrapInput.displayName = 'BootstrapInput'

export default BootstrapInput