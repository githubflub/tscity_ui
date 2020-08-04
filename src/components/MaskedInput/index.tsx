import React from 'react'
import PropTypes from 'prop-types'
import ReactTextMaskInput from 'react-text-mask'

function MaskedInput (props) {
   const { inputRef, ...other } = props;

   return (
      <ReactTextMaskInput
         {...other}
         ref={ref => {
            inputRef(ref? ref.inputElement : null)
         }}
         mask={['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
         placeholderChar={'\u2000'}
         // showMask
      />
   )
}

MaskedInput.propTypes = {
   inputRef: PropTypes.func.isRequired,
}

export default MaskedInput