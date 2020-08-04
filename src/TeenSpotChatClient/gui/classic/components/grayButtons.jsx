import React, { Component } from 'react'
import tsccColors from 'TeenSpotChatClient/constants/tsccTextColors.jsx';
import bg_color_button_icon from 'TeenSpotChatClient/assets/tsccGrayButtonBGColor.png'
import font_color_button_icon from 'TeenSpotChatClient/assets/tsccGrayButtonFontColor.png'

class GrayButtons extends Component {
    constructor() {
        super();
        this.state = {
            openMenuElement: null,
            openMenuButton: null
        };
    }

    test() { console.log("waaat"); }

    closeMenu(event) {
        // if no openMenuElement, do nothing.
        if (this.state.openMenuElement == null)
            return;

        this.state.openMenuElement.style.display = "none";
        this.state.openMenuButton = null;
    }

    grayButtonOnClick(event) {
        console.log("you clicked a gray button");
        let dataTarget = event.target.dataset.target;
        let menu = document.getElementById(dataTarget);
        if (menu == null) { console.log("Check data-target"); }
        this.test();

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

            if (event.target == this.state.openMenuButton)
            {
                // do nothing
                console.log("do nothing");
                return;
            }

            console.log("closing menu");
            let menu = this.state.openMenuElement;
            menu.style.display = "none";
        };

        // Show menu where mouse was clicked
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';

        if (menu.style.display == "none") {
            // close any open menus
            this.closeMenu();
            console.log("opening a menu");
            menu.style.display = "flex";
            this.state.openMenuElement = menu;
            this.state.openMenuButton = event.target;
        } else {
            console.log("not opening a menu");
            menu.style.display = "none";
        }
    }

    onMenuItemClick(event) {
        this.closeMenu();
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
                break;
            case "bgColorWhite":
                console.log("you selected bg color white");
                break;
            case "bgColorDefault":
                console.log("you selected bg color default");
                break;
            case "fontColorWhite":
                console.log("you selected font color white");
                break;
            case "fontColorDefault":
                console.log("you selected font color default");
                break;
            default:
                console.log("hi there");
                break;
        }
    }

    render() {
        return (
            <div className="tsccGrayButtonsRow">
                <div>
                    <button data-target="fontColorMenu" className="tsccGrayButton" onClick={(event) => this.grayButtonOnClick(event)}>
                        <img src={font_color_button_icon}/>
                    </button>
                    <div id="fontColorMenu" className="tsccContextMenu" style={{display: "none"}}>
                        <div id="fontColorCyan" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>Cyan</div>
                        <div id="fontColorBrown" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>Brown</div>
                        <div id="fontColorLightGray" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>Light Gray</div>
                        <div id="fontColorGray" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>Gray</div>
                        <div id="fontColorWhite" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>White</div>
                        <div id="fontColorDefault" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>Default</div>
                    </div>
                </div>
                <div>
                    <div id="bgColorMenu" className="tsccContextMenu" style={{display: "none"}}>
                        <div id="bgColorCyan" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>Cyan</div>
                        <div id="bgColorBrown" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>Brown</div>
                        <div id="bgColorLightGray" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>Light Gray</div>
                        <div id="bgColorGray" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>Gray</div>
                        <div id="bgColorWhite" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>White</div>
                        <div id="bgColorDefault" className="tsccContextMenuItem" onClick={(event) => this.onMenuItemClick(event)}>Default</div>
                    </div>
                    <button id="bgGrayButton" data-target="bgColorMenu" className="tsccGrayButton" onClick={(event) => this.grayButtonOnClick(event)}>
                        <img src={bg_color_button_icon}/>
                    </button>
                </div>
            </div>
        )
    }
}

export default GrayButtons;