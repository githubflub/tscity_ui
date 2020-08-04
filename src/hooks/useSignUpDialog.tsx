import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog';
import ModalBody from 'components/ModalBody'
import ModalSignUpForm from 'routes/Home/containers/ModalSignUpForm/index.jsx'
import CloseButtonSpinny from 'components/CloseButtonSpinny'
import { useScreenSize } from 'hooks/useScreenSize'

export function useSignUpDialog() {
   const [show_sign_up_dialog, setShowSignUpDialog] = useState(false)
   const [screen_width] = useScreenSize();

   const openSignUpDialog = () => {
      setShowSignUpDialog(true)
   }

   const closeSignUpDialog = () => {
      setShowSignUpDialog(false)
   }

   return {
      show_sign_up_dialog,
      openSignUpDialog,
      closeSignUpDialog,
      SignUpDialog: (
         <Dialog
            fullScreen={screen_width > MOBILE_SIZE? false : true}
            onClose={closeSignUpDialog}
            open={show_sign_up_dialog}
         >
            <div style={styles.modalHeader}>
               <h2>Sign up!<CloseButtonSpinny onClick={closeSignUpDialog} /></h2>
            </div>
            <ModalBody>
               <div style={styles.modalBody}>
                  <ModalSignUpForm onClose={closeSignUpDialog} />
               </div>
            </ModalBody>
         </Dialog>
      )
   }
}

type StylesObjectType = {
   [key: string]: React.CSSProperties
}

const styles: StylesObjectType = {
   modalHeader: {
      backgroundColor: '#f2f4f8',
      padding: '16px',
      position: 'relative'
   },
   modalBody: {
      // padding: '16px 0px',
      position: 'relative',
      width: '100%'
   },
}