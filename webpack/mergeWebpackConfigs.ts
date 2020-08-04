import webpack from 'webpack'
import { mergeWith } from 'lodash'

export default function mergeWebpackConfigs(obj: any, src: any, key: any) {
   // Merge rules
  if (key === "rules" && [obj, src].every(v => Array.isArray(v))) {
   src.forEach((v: webpack.Rule, _i: number) => {
     const existingTest = (obj as webpack.Rule[]).find(
       rule => String(rule.test) === String(v.test)
     );

     if (existingTest) {
       mergeWith(existingTest, v, mergeWebpackConfigs);
     } else {
       obj.push(v);
     }
   });

   return obj;
 }

 // Merge rules loader uses
 if (key === "use" && [obj, src].every(v => Array.isArray(v))) {
   src.forEach((v: webpack.Rule, _i: number) => {
     const existingLoader = (obj as webpack.Rule[]).find(
       rule => String(rule.loader) === String(v.loader)
     );

     if (existingLoader) {
       mergeWith(existingLoader, v, mergeWebpackConfigs);
     } else {
       obj.push(v);
     }
   });

   return obj;
 }

 // By default, merge arrays
 if (Array.isArray(obj)) {
   return obj.concat(src);
 }
}