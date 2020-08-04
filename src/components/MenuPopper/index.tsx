import React from 'react'
import ReactIs from 'react-is';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';

export default function MenuPopper(props) {
   const {
      open,
      onClose,
      anchorEl,
      placement,
      menu_list_id,
      children,
      ...other
   } = props;

   const handleClose = event => {
      if (anchorEl && anchorEl.contains(event.target)) {
         return;
      }

      onClose(event);
   }

   const preventViewportOverflow = {
      name: 'preventViewportOverflow',
      enabled: true,
      phase: 'main',
      fn(state, modifier) {
         const { instance } = state;
         const top_viewport_offset = state.popper.top;
         instance.popper.style.maxHeight = `${window.innerHeight - top_viewport_offset}px`;
         instance.popper.style.maxWidth = `${state.popper.right}px`;

         return state;
      },
   };

   const popper_styles: { width?: string; height?: string } = {}
   if ((other.style || {}).width || (other.style || {}).width === 0) {
      popper_styles.width = other.style.width;
      delete other.style.width;
   }

   if ((other.style || {}).height || (other.style || {}).height === 0) {
      popper_styles.height = other.style.height;
      delete other.style.height;
   }



   return (
      <Popper
         open={open}
         role={undefined}
         anchorEl={anchorEl}
         placement={placement}
         transition
         modifiers={{
            flip: {
               enabled: false,
            },
            hide: {
               enabled: false,
            },
            preventOverflow: {
               enabled: false,
            },
            preventViewportOverflow,
         }}
         style={popper_styles}
      >
         {args => {
            const {
               TransitionProps,
               placement
            } = args;

            return (
               <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom-end'? 'right top' : 'center top' }}
               >
                  <Paper
                     {...other}
                     style={{
                        ...other.style,
                        height: '100%',
                        width: '100%',
                     }}
                  >
                     <ClickAwayListener onClickAway={handleClose}>
                        {React.Children.count(children) > 1 || ReactIs.isFragment(children)
                           /* ClickAwayListener requires only 1 child, so force it if needed. */
                           ? <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
                              {children}
                           </div>
                           : children
                        }
                     </ClickAwayListener>
                  </Paper>
               </Grow>
            )
         }}
      </Popper>
   )
}