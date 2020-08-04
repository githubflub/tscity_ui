import React from 'react'
import classnames from 'classnames'
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import MaskedInput from '../MaskedInput'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import {
   makeStyles,
} from '@material-ui/core'

// https://material-ui.com/customization/components/

const useStyles = makeStyles(theme => ({
   control: {
      width: '100%'
   },
   help: props => {
      return {
         color: props.color === 'teal'? theme.palette.primary.main
            : props.color === 'red'? theme.palette.error.main
            : theme.palette.primary.main,
      }
   },
   label: props => {
      return {
         color: props.color === 'teal'? theme.palette.primary.main
            : props.color === 'red'? theme.palette.error.main
            : theme.palette.primary.main,
         '&$label_focused': {
            color: props.color === 'teal'? theme.palette.primary.main
               : props.color === 'red'? theme.palette.error.main
               : theme.palette.primary.main,
         }
      }
   },
   label_focused: props => {
      return {}
   },
   // input: props => {
   //    return {
   //       color: props.color === 'teal'? theme.palette.primary.main
   //          : props.color === 'red'? theme.palette.error.main
   //          : theme.palette.primary.main
   //    }
   // },
   input_underline: props => {
      return {
         '&:before': {
            borderColor: props.color === 'teal'? theme.palette.primary.main
               : props.color === 'red'? theme.palette.error.main
               : theme.palette.primary.main,
         },
         '&:hover:not(.Mui-disabled):before': {
            borderColor: props.color === 'teal'? theme.palette.primary.main
            : props.color === 'red'? theme.palette.error.main
            : theme.palette.primary.main,
         },
         '&:after': {
            borderColor: props.color === 'teal'? theme.palette.primary.main
               : props.color === 'red'? theme.palette.error.main
               : theme.palette.primary.main
         },
      }
   }

}))

function MaterialInput(props) {
   const {
      id = 'component_simple',
      value,
      onChange,
      label,
      type = 'text',
      formgroup_classes,
      mask,
      shrink,
      help,
      status,
      input_props,
   } = props

   const classes = useStyles(props);

   return (
      <FormControl
         classes={{
            root: classes.control,
            ...formgroup_classes
         }}
      >
         <InputLabel
            htmlFor={id}
            shrink={shrink}
            classes={{
               root: classes.label,
               focused: classes.label_focused
            }}
         >
            {label}
         </InputLabel>
         <Input
            id={id}
            classes={{
               underline: classes.input_underline
            }}
            className={classes.input}
            value={value || ''}
            onChange={onChange}
            inputComponent={mask === 'phone'? MaskedInput : undefined}
            type={type}
            {...input_props}
            // aria-describedby="component-helper-text"
         />
         <FormHelperText
            // id="component-helper-text"
            margin="dense"
            error={status === 'error'}
            classes={{
               root: classes.help
            }}
         >
            {help}
         </FormHelperText>
      </FormControl>
   )
}

export default MaterialInput