export function arraySortedInsert(array, item2, key) {
   let insert_index = null;

   for (let i = 0; i < array.length; i++) {
      const item = array[i];
      if (item[key] > item2[key]) {
         // Insert at this index.
         insert_index = i;
         break;
      }
   }

   if (insert_index === null) {
      array.push(item2);
   }
   else {
      array.splice(insert_index, 0, item2);
   }
}