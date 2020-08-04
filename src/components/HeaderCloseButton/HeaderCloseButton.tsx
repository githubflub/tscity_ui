import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const UserCloseIcon = withStyles({
   root: {
      color: 'rgba(255,255,255,0.88)'
   }
})(CloseIcon)

const UserArrowIcon = withStyles({
   root: {
      color: 'rgba(255,255,255,0.88)'
   }
})(ArrowBackIcon)

const UserCloseIconButton = withStyles({
   root: {
      borderRadius: '4px',
      '&:hover': {
         backgroundColor: 'rgba(255, 255, 255, 0.08)'
      }
   }
})(IconButton)

const useStyles = makeStyles({
   child: {
      borderRadius: '4px'
   }
})

export default function HeaderCloseButton(props) {
   const {
      onClick,
      arrow,
      absolute,
      ...other
   } = props;
   const classes = useStyles(props);

   let styles = absolute? {
      position: 'absolute',
      right: '0px',
   } : {}

   return (
      <UserCloseIconButton
         aria-label="close"
         size="small"
         TouchRippleProps={{
            classes: {
               child: classes.child
            }
         }}
         onClick={onClick}
         {...other}
         style={{
            ...styles,
            ...other.style,
         }}
      >
         {arrow? <UserArrowIcon /> : <UserCloseIcon />}
      </UserCloseIconButton>
   )
}