import { useSelector, useDispatch } from 'react-redux'
import { closeNavbarMenu, openNavbarMenu } from 'redux_store/modules/navbar';

export function useNavMenu(name: string) {
   const { open_menu_name } = useSelector(state => state.navbar);
   const dispatch = useDispatch();

   const handleClick = event => {
      dispatch(openNavbarMenu({ name }))
   };

   const handleClose = (event?) => {
      dispatch(closeNavbarMenu({ event }))
   };

   return {
      open_menu_name,
      handleClick,
      handleClose,
   }
}