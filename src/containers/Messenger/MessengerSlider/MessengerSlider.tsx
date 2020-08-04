import React, { useState, useRef, useEffect } from 'react'
// import { useUpdateEffect } from 'hooks/useUpdateEffect'
import './MessengerSlider.scss'
import TSCard from 'components/TSCard';
import TSCardHeader from 'components/TSCard/components/TSCardHeader';
import TSCardContentLight from 'components/TSCard/components/TSCardContentLight';

const body_height = 300;
export default function MessengerSlider(props) {
   const {
      WithRespectTo,
      PullTab,
      start_open,
      use_outside_state,
      is_open,
      onTabClick,
      style,
   } = props;

   const initial_state = use_outside_state
      ? is_open || !!start_open
      : !!start_open

   const [open, setOpen] = useState(initial_state);
   // const [body_height, setBodyHeight] = useState(null);
   const body_ref = useRef(null);

   // Under the assumption that, by the
   // first time this runs, the relevant
   // elements have all been rendered and
   // have accurate heights.
   // useEffect(
   //    () => {
   //       updateBodyHeight();
   //    },
   //    []
   // )

   // const updateBodyHeight = () => {
   //    const body_height = body_ref.current.clientHeight;
   //    setBodyHeight(body_height);
   // }

   const onTabClickPrivate = () => {
      // updateBodyHeight();
      setOpen(current_open => !current_open);
   }

   const final_open = use_outside_state
      ? is_open
      : open;

   let styles;
   if (!final_open) {
      styles = {
         transform: `translate3d(0px, ${body_height + 1}px, 0px)`
      }
   }

   return (
      <TSCard className={"MessengerSlider"} style={{ ...styles, ...style }}>
         <TSCardHeader onClick={use_outside_state? onTabClick : onTabClickPrivate}>
            {PullTab}
         </TSCardHeader>
         <TSCardContentLight ref={body_ref} style={{ height: `${body_height}px`}} no_padding>
            {WithRespectTo}
         </TSCardContentLight>
      </TSCard>
   );
}