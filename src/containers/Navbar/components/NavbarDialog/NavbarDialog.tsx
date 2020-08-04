import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import './NavbarDialog.scss'

export default function NavbarDialog(props) {
   const { nav_height, is_open } = props;

   return (
      <Dialog
         fullScreen
         open={is_open}
         BackdropProps={{
            style: {
               top: `${nav_height}px`
            }
         }}
         PaperProps={{
            className: "NavbarDialog TSBase__dark",
         }}
         style={{
            top: `${nav_height}px`
         }}
      >
         {props.children}
      </Dialog>
   );
}