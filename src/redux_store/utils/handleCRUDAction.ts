export const handleCRUDAction = (entity, action, step, result?) => {
   switch (step) {
     case 'CALL':
       return {
         [`${entity}_${action}_ing`]: true,
         [`${entity}_${action}_data`]: null,
         [`${entity}_${action}_error`]: null,
         [`${entity}_${action}_status`]: null,
       }
     case 'PASS':
       return {
         [`${entity}_${action}_ing`]: false,
         [`${entity}_${action}_ed`]: true,
         [`${entity}_${action}_data`]: result,
         [`${entity}_${action}_error`]: null,
       }
     case 'FAIL':
       return {
         [`${entity}_${action}_ing`]: false,
         [`${entity}_${action}_ed`]: true,
         [`${entity}_${action}_data`]: null,
         [`${entity}_${action}_error`]: result,
         [`${entity}_${action}_status`]: null,
       }
     case 'CLEAR':
       return {
         [`${entity}_${action}_ing`]: false,
         [`${entity}_${action}_ed`]: false,
         [`${entity}_${action}_data`]: null,
         [`${entity}_${action}_error`]: null,
         [`${entity}_${action}_status`]: null,
       }
     case 'STATUS':
       return {
         [`${entity}_${action}_status`]: result,
       }
   }

   return {};
 }