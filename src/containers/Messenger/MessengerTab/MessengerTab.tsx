import React from 'react'
import HeaderCloseButton from 'components/HeaderCloseButton/HeaderCloseButton'
import classnames from 'classnames'

type MessengerTabProps = {
   label?: React.ReactNode;
   onClose?: () => any;
   className?: string;
}

export default function MessengerTab(props: MessengerTabProps) {
   const { label = '', className, onClose } = props;

   return (
      <div className={classnames("MessengerTab", className)}>
         {label}
         {onClose && <HeaderCloseButton onClick={onClose} absolute />}
      </div>
   )
}