import React, { useState } from 'react'
import { useScreenSize } from './useScreenSize';
import Dialog from '@material-ui/core/Dialog';
type UseDialogOptions = {
   contained?: any;
}
export function useDialog(options: UseDialogOptions = {}) {
   const { contained } = options;
   const [show_dialog, setShowDialog] = useState(false);
   const [screen_width] = useScreenSize();

   const openDialog = () => {
      setShowDialog(true);
   }

   const closeDialog = () => {
      setShowDialog(false);
   }

   return {
      show_dialog,
      openDialog,
      closeDialog,
      createDialog: (children) => (
         contained? (
            show_dialog
               ? <div
                  className="TSContainedDialog"
                  style={{
                     position: 'absolute',
                     top: '0px',
                     bottom: '0px',
                     left: '0px',
                     right: '0px',
                     cursor: 'default',
                     padding: '6px 16px',
                  }}
                  onClick={event => event.stopPropagation()}
               >
                  {children}
               </div>
               : null
         ) : (
            <Dialog
               fullScreen={screen_width > MOBILE_SIZE? false : true}
               onClose={closeDialog}
               open={show_dialog}
            >
               {children}
            </Dialog>
         )
      )
   }
}