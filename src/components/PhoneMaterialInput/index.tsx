import React from 'react'
import MaterialInput from '../MaterialInput'
import MaskedInput from '../MaskedInput'

function PhoneMaterialInput(props) {
   return (
      <MaterialInput
         {...props}
         input_component={MaskedInput}
      />
   )
}

export default PhoneMaterialInput