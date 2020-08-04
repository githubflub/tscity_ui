import { createMuiTheme } from '@material-ui/core/styles';
import variables from './variables.scss'

export function createMaterialUiTheme() {

   const teal = {
      main: variables.teal_main,
      light: variables.teal_light,
      very_light: variables.teal_very_light,
   }

   const red = {
      main: variables.red_main,
      light: variables.red_light,
      very_light: variables.red_very_light,
   }

   const theme = {
      palette: {
         primary: teal,
         secondary: red,
         error: red,
         orange: {
            main: variables.orange_main,
            light: variables.orange_light,
            very_light: variables.orange_very_light,
         },
         green: {
            main: variables.green_main,
            light: variables.green_light,
            very_light: variables.green_very_light,
         },
         blue: {
            main: variables.blue_main,
            light: variables.blue_light,
            very_light: variables.blue_very_light,
         }
      }
   }

   return createMuiTheme(theme)
}