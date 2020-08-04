import React from 'react'
import { Link } from 'react-router-dom'
import { useScreenSize } from 'hooks/useScreenSize'
import { useSelector, useDispatch } from 'react-redux'
// import MobileLoginForm from './components/MobileLoginForm'
import teenspot_header_logo from 'assets/ts_city_logo.png'
import teenspot_mini_logo from 'assets/teenspot_icon.png'
// import teenspot_icon from 'assets/teenspot-icon.png'
import CloseButtonSpinny from 'components/CloseButtonSpinny'
import './Navbar.scss'
import { closeNavbarMenu } from 'redux_store/modules/navbar'
import loadable from '@loadable/component'

// lazy load
const BrandBarWrapper = loadable(
   () => import(/* webpackChunkName: 'BrandBarComponent' */ './components/BrandBarWrapper/BrandBarWrapper'),
   { fallback: <div /> }
)

const nav_links = [
   {
      display_name: 'Home',
      pathname: '/',
   },
   {
      display_name: 'Chat',
      pathname: '/chat',
   },
   {
      display_name: 'Profiles',
      pathname: '/profiles',
   },
   // {
   //    display_name: 'Stats',
   //    pathname: '/stats',
   // }
]

function Navbar(props) {
   const {
      login_status_checked,
      is_authenticated
   } = useSelector(state => state.session)
   const {
      is_dialog_open
   } = useSelector(state => state.navbar);
   const dispatch = useDispatch();
   const nav_ref = React.useRef(null);
   const [nav_height, setNavHeight] = React.useState(0);
   const [screen_width] = useScreenSize();

   React.useEffect(
      () => {
         const node = nav_ref.current;
         if (node) {
            // Assuming this doesn't cause
            // rerenders because height
            // won't change.
            setNavHeight(node.clientHeight);
         }
      }
   )

   const logo_image = screen_width < TABLET_SIZE? teenspot_mini_logo : teenspot_header_logo

   return (
      <nav className="teenspot_navbar">
         <div ref={nav_ref} className="teenspot_navbar_top_half">
            <div className="teenspot_navbar_container">
               <div className="teenspot_navbar_group teenspot_navbar_logo">
                  {is_dialog_open
                     ? <CloseButtonSpinny onClick={() => dispatch(closeNavbarMenu())} />
                     : <Link to="/"><img alt="TS" src={logo_image}/></Link>
                  }
               </div>
               <div className="teenspot_navbar_group">
                  {(login_status_checked && is_authenticated)
                     ? <BrandBarWrapper nav_height={nav_height} />
                     : null
                  }
               </div>
            </div>
         </div>

         <div className="teenspot_navbar_nav_links">
            <div className="teenspot_navbar_container">
               {nav_links.map((link, index) => {
                  return (
                     <div key={index} className="teenspot_navbar_nav_link">
                        <Link to={link.pathname}>{link.display_name}</Link>
                     </div>
                  )
               })}
            </div>
         </div>
      </nav>
   )
}

export default Navbar