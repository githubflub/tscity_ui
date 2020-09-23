import React, { Component, useState } from 'react';
import { connect } from 'react-redux';
import { TSChatClient } from 'TeenSpotChatClient/client/TSChatClient'
import { useLoginForm } from 'hooks/useLoginForm'
import { useChatInput } from 'TeenSpotChatClient/hooks/useChatInput'
import TsccChatInput from './TsccChatInput'
import HelpText from 'components/HelpText'
import tsccColors from 'TeenSpotChatClient/constants/tsccTextColors.jsx';
import bg_color_button_icon from 'TeenSpotChatClient/assets/tsccGrayButtonBGColor.png'
import font_color_button_icon from 'TeenSpotChatClient/assets/tsccGrayButtonFontColor.png'

function ChatInputArea(props) {
   const [openMenuElement, setOpenMenuElement] = useState(null)
   const [openMenuButton, setOpenMenuButton] = useState(null)
   const {
      message,
      setMessage,
      onInputSubmit,
      onChatInputBlur,
      chat_input_ref,
   } = useChatInput()
   const {
      username,
      password,
      login_form,
      onLoginFormChange,
      handleLoginFormSubmit,
      ForgotPasswordLink,
      SignUpLink,
      SignUpDialog,
      show_verification_input,
      verification_code,
   } = useLoginForm()


   const { session } = props
   const { login_status_checked, is_authenticated } = session

   const closeMenu = (event) => {
      // if no openMenuElement, do nothing.
      if (openMenuElement == null) {
         return;
      }

      openMenuElement.style.display = "none";
      openMenuButton = null;
   }

   const grayButtonOnClick = (event) => {
      // use currentTarget for Chrome compatability.
      console.log("button clicked", event.currentTarget);
      let dataTarget = event.currentTarget.dataset.target;
      console.log("dataTarget", dataTarget);
      let menu = document.getElementById(dataTarget);
      if (menu === null) { console.log("Check data-target"); }

      // Handle closing of menu when clicking outside
      document.onclick = (event) => {
         let target = event.target;
         while (target.parentNode) {
               if (target.classList.contains("tsccContextMenu"))
               {
                  return;
               }
               target = target.parentNode;
         }

         if (event.target == openMenuButton)
         {
               // do nothing
               console.log("do nothing");
               return;
         }

         console.log("closing menu");
         let menu = openMenuElement;
         menu.style.display = "none";
      };

      // Show menu where mouse was clicked
      menu.style.left = event.pageX + 'px';
      menu.style.top = event.pageY + 'px';

      if (menu.style.display == "none") {
         // close any open menus
         closeMenu();
         console.log("opening a menu");
         menu.style.display = "flex";
         openMenuElement = menu;
         openMenuButton = event.target;
      } else {
         console.log("not opening a menu");
         menu.style.display = "none";
      }
   }

   const onMenuItemClick = (event) => {
      closeMenu();
      switch (event.target.id) {
         case "bgColorCyan":
               console.log("you selected bg color Cyan");
               break;
         case "bgColorGray":
               console.log("you selected bg color gray!");
               break;
         case "bgColorLightGray":
               console.log("you selected bg color light gray!");
               break;
         case "bgColorBrown":
               console.log("you selected bg color brown!");
               // this.props.setMainBGColor(tsccColors.BROWN);
               // console.log("execCommand result:", document.execCommand("styleWithCss", false, true));
               // console.log("execCommand result:", document.execCommand('hiliteColor',false, "rgb(0,0,0)"));
               // console.log("execCommand result:", document.execCommand("bold", false, null));
               break;
         case "bgColorWhite":
               console.log("you selected bg color white");
               break;
         case "bgColorDefault":
               console.log("you selected bg color default");
               break;
         case "fontColorWhite":
               console.log("you selected font color white");
               // this.props.setMainFontColor(tsccColors.WHITE);
               break;
         case "fontColorDefault":
               console.log("you selected font color default");
               break;
         default:
               console.log("hi there");
               break;
      }
   }

   const onFormSubmit = (event) => {
      event.preventDefault();

      if (is_authenticated) {
         onInputSubmit(event);
      }
      else {
         handleLoginFormSubmit(event)
      }
   }

   return (
      <div>
         <div className="tsccChatInputAreaContainer">
            <div className="tsccChatInputArea">
               <form className="tsccMainInputForm" onSubmit={onFormSubmit} autoComplete="off">
                  <div className="tsccChatInputFieldContainer">
                     {  is_authenticated?
                           <TsccChatInput
                              id="myInput"
                              className="tsccMainInputElement"
                              value={message.value || ''}
                              maxLength={280}
                              onChange={event => setMessage({ value: event.target.value || '' })}
                              input_ref={chat_input_ref}
                              onBlur={onChatInputBlur}
                           />
                        :  <div className="tscc_chat_login_input_wrapper">
                              <TsccChatInput
                                 id="myUsernameInput"
                                 className="tsccMainInputElement"
                                 validation_status={login_form.status || username.status}
                                 value={username.value || ''}
                                 name="username"
                                 autoComplete="username"
                                 placeholder="Username or email"
                                 onChange={onLoginFormChange}
                              />
                              <div style={{ minWidth: '12px' }}/>
                              <TsccChatInput
                                 id="myPasswordInput"
                                 className="tsccMainInputElement"
                                 validation_status={login_form.status || password.status}
                                 name="password"
                                 placeholder="Password"
                                 autoComplete="current-password"
                                 value={password.value || ''}
                                 onChange={onLoginFormChange}
                                 type="password"
                              />
                              {!show_verification_input? null :
                                 <React.Fragment>
                                    <div style={{ minWidth: '12px' }}/>
                                    <TsccChatInput
                                       id="myVerificationCodeInput"
                                       className="tsccMainInputElement"
                                       validation_status={login_form.status || verification_code.status}
                                       name="verification_code"
                                       placeholder="Verification Code"
                                       value={verification_code.value || ''}
                                       onChange={onLoginFormChange}
                                       type="number"
                                       pattern="[0-9]*"
                                    />
                                 </React.Fragment>
                              }
                           </div>
                     }
                  </div>
                  <button type="submit" className="tsccMainInputFormButton">{is_authenticated? 'SEND' : 'LOGIN'}</button>
               </form>
            </div>
            {is_authenticated? null
               :  <div className="tscc_chat_input_area_help">Log in to join the chat! {ForgotPasswordLink} {SignUpLink} <HelpText
                     show={login_form.status === 'error' || username.status === 'error' || password.status === 'error' || verification_code.status === 'error'}
                     error={login_form.status === 'error' || username.status === 'error' || password.status === 'error' || verification_code.status === 'error'}
                  >
                     {login_form.message || username.message || password.message || verification_code.message}
                  </HelpText></div>
            }
         </div>
         {SignUpDialog}



         {/* <div className="tsccGrayButtonsRow">
            <div>
               <button data-target="fontColorMenu" className="tsccGrayButton" onClick={(event) => grayButtonOnClick(event)}>
                  <img src={font_color_button_icon}/>
               </button>
               <div id="fontColorMenu" className="tsccContextMenu" style={{display: "none"}}>
                  <div id="fontColorCyan" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>Cyan</div>
                  <div id="fontColorBrown" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>Brown</div>
                  <div id="fontColorLightGray" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>Light Gray</div>
                  <div id="fontColorGray" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>Gray</div>
                  <div id="fontColorWhite" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>White</div>
                  <div id="fontColorDefault" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>Default</div>
               </div>
            </div>
            <div>
               <div id="bgColorMenu" className="tsccContextMenu" style={{display: "none"}}>
                  <div id="bgColorCyan" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>Cyan</div>
                  <div id="bgColorBrown" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>Brown</div>
                  <div id="bgColorLightGray" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>Light Gray</div>
                  <div id="bgColorGray" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>Gray</div>
                  <div id="bgColorWhite" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>White</div>
                  <div id="bgColorDefault" className="tsccContextMenuItem" onClick={(event) => onMenuItemClick(event)}>Default</div>
               </div>
               <button id="bgGrayButton" data-target="bgColorMenu" className="tsccGrayButton" onClick={(event) => grayButtonOnClick(event)}>
                  <img src={bg_color_button_icon}/>
               </button>
            </div>
         </div> */}
      </div>
   )

}

export default ChatInputArea;