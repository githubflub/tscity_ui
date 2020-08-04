import React from 'react'
import Popper from '@material-ui/core/Popper';

export default function DraggablePopper(props) {
   const { children, style, ...other_props } = props;

   return (
      <Popper
         style={{
            cursor: 'all-scroll',
            ...style,
         }}
         {...other_props}
         popperOptions={{
            onCreate: (data_object) => {
               const { instance, popper } = data_object;

               // Turn off all modifiers because
               // they miss with the dragging behavior
               for (let i = instance.modifiers.length - 1; i >= 0; i--) {
                  instance.modifiers[i].enabled = false;
               }

               let is_dragging = false;
               let is_down = false;
               let initial_drag_position;

               const onMouseMove = (event) => {
                  if (is_down) {
                     is_dragging = true;

                     const diff_x = event.screenX - initial_drag_position.x
                     const diff_y = event.screenY - initial_drag_position.y

                     instance.popper.style.transform = `translate3d(${popper.left + diff_x}px, ${popper.top + diff_y}px, 0px)`
                  }
               }

               const onMouseUp = (event) => {
                  if (is_dragging && is_down) {
                     const diff_x = event.screenX - initial_drag_position.x
                     const diff_y = event.screenY - initial_drag_position.y

                     popper.left = popper.left + diff_x;
                     popper.top = popper.top + diff_y;
                  }

                  is_down = false;
                  is_dragging = false;
                  window.removeEventListener('mousemove', onMouseMove)
                  window.removeEventListener('mouseup', onMouseUp)
               }

               instance.popper.onmousedown = (event) => {
                  // Prevents all the text on the page from
                  // being selected when I drag around.
                  event.preventDefault();

                  initial_drag_position = {
                     x: event.screenX,
                     y: event.screenY
                  }

                  is_down = true;

                  window.addEventListener('mousemove', onMouseMove)
                  window.addEventListener('mouseup', onMouseUp)
               }


            }
         }}
      >
         {children}
      </Popper>
   )
}