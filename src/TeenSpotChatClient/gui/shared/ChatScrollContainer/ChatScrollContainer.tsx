import React, { useState, useCallback, useEffect } from 'react'
import classnames from 'classnames'
import './ChatScrollContainer.scss'



type ChatScrollContainerPropsType = React.HTMLAttributes<HTMLElement> & {
   // Renders scrollbar without
   // changing width of container
   overlay?: boolean;

   // Prevents scrollbar from sticking to
   // the bottom. The sticky feature is
   // useful for scrolling a chat.
   no_stick?: boolean;

   // In case you want to render contents
   // with a function, which passes
   // some arguments.
   render?: (args: { scroll_is_showing: boolean }) => React.ReactNode;

   // Hides scrollbar
   hidden?: boolean;
}

const ChatScrollContainer: React.FunctionComponent<ChatScrollContainerPropsType> = function(props)  {
   const { overlay, render, no_stick, hidden, className, ...other_props } = props;
   const [user_is_scrolled, setUserIsScrolled] = useState(false);
   const [scroll_is_showing, setScrollIsShowing] = useState(false);

   const onScroll = event => {
      // console.log('scrolling!');
      // console.dir(event.target);

      const node = event.target;
      const diff = node.scrollHeight - node.clientHeight
      // console.log("node.scrollTop", node.scrollTop);
      // console.log("diff", diff);

      // node.scrollTop is not always an integer, but
      // if it's within 1 of diff, then consider it to
      // be equal to diff.
      if (Math.abs(diff - node.scrollTop) < 1) {
         // console.log("User is NOT scrolled.")
         setUserIsScrolled(false)
      }
      else {
         // console.log("User IS scrolled.")
         setUserIsScrolled(true);
      }
   }

   // Scroll to bottom!
   const scroll_container_ref = useCallback(node => {
      if (node !== null) {
         const diff = node.scrollHeight - node.clientHeight
         // console.log("IM NOT NULL YAY", node.scrollHeight, node.clientHeight, diff);
         // console.dir(node)
         // console.log("user_is_scrolled?", user_is_scrolled)
         if (diff > 0 && !user_is_scrolled) {
            if (!no_stick) { node.scrollTop = diff }
         }
         else if (diff <= 0 && user_is_scrolled) {
            // If user is scrolled, but they resize the window
            // such that the whole chat fits in the div and there
            // is no scroll bar, I consider them to be not scrolled anymore
            // and set state accordingly.
            setUserIsScrolled(false);
         }

         if (diff > 0) {
            setScrollIsShowing(true)
         }
         else if (diff <= 0) {
            setScrollIsShowing(false)
         }
      }
   }, undefined);

   const scroll_classname = classnames({
      'chat_scroll_container': true,
      'chat_scroll_container__overlay': overlay && scroll_is_showing,
      'chat_scroll_container__hidden': hidden,
   }, className)


   return (
      <div className={scroll_classname}>
         <div ref={scroll_container_ref} onScroll={onScroll} className="chat_scroll_container__scrollbar" {...other_props}>
            <div className="chat_scroll_container__content">
               {render? render({ scroll_is_showing }) : props.children}
            </div>
         </div>
      </div>
   )
}

ChatScrollContainer.defaultProps = {
   overlay: false,
   no_stick: false,
   hidden: false,
}

export default ChatScrollContainer;