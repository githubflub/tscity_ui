import React, { useState } from 'react'

function EditRow(props) {
   const {
      label,
      hide_change_button,
      onCancel,
      main_content,
      extra_content,
      is_loading,
   } = props;
   const [edit_row_open, setEditRowOpen] = useState(false);

   const onCancelClick = () => {
      onCancel && onCancel()
      setEditRowOpen(false);
   }

   const onChangeButtonClick = () => {
      setEditRowOpen(true);
   }

   return (
      <div className="edit_email">
         <label className="edit_email__label">{label}</label>
         <div className="edit_email__input_row">
            <div className="edit_email__input_row__left">
               {is_loading? <div>loading...</div> : main_content}
            </div>
            <div className="edit_email__input_row__right">
               {is_loading? <React.Fragment></React.Fragment> :
                  edit_row_open?
                     <React.Fragment>
                        <a onClick={onCancelClick}>Cancel</a>
                     </React.Fragment>
                  :  <React.Fragment>
                        <a onClick={onChangeButtonClick}>{'Change'}</a>
                     </React.Fragment>
               }
            </div>
         </div>
         {edit_row_open &&
            <div className="edit_email__extra_row">
               {extra_content}
            </div>
         }

      </div>
   )
}

EditRow.defaultProps = {
   hide_change_button: false
}

export default EditRow