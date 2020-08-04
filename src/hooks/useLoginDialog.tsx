import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog';
import ModalBody from 'components/ModalBody'
import LoginForm from 'containers/LoginForm/LoginForm'
import CloseButtonSpinny from 'components/CloseButtonSpinny'
import { useScreenSize } from 'hooks/useScreenSize'

export function useLoginDialog() {
   const [show_login_dialog, setShowLoginDialog] = useState(false)
   const [screen_width] = useScreenSize();

   const openLoginDialog = () => {
      setShowLoginDialog(true)
   }

   const closeLoginDialog = () => {
      setShowLoginDialog(false)
   }

   return {
      show_login_dialog,
      openLoginDialog,
      closeLoginDialog,
      LoginDialog: (
         <Dialog
            fullScreen={screen_width > MOBILE_SIZE? false : true}
            onClose={closeLoginDialog}
            open={show_login_dialog}
         >
            <div style={styles.modalHeader}>
               <h2>Login!<CloseButtonSpinny onClick={closeLoginDialog} /></h2>
            </div>
            <ModalBody>
               <div style={styles.modalBody}>
                  <LoginForm />
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
      padding: '16px',
      position: 'relative',
      width: '100%',
   },
}