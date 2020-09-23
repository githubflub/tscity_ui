import React from 'react'
import classnames from 'classnames'

function TsccChatInput(props) {
   const {
      validation_status,
      input_ref,
      ...input_props
   } = props;

   const classname = classnames({
      'tsccMainInputWrapper': true,
      'tscc_chat_input__error': validation_status === 'error'
   })

   return (
      <div className={classname}>
         <input ref={input_ref} {...input_props} />
      </div>
   )
}

export default TsccChatInput;