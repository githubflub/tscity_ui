
import { matchPath } from 'react-router'
import route_tree from './'

export function getParams(path) {
   const result = helper(path, route_tree)
   return result; 
}

function helper(path, routes, path_prefix = '', collection = {}) {
   if (!routes || !Object.keys(routes).length) {
      return collection; 
   }

   if (path === path_prefix) {
      return collection
   }

   for (let key in routes) {
      const route = routes[key]

      let new_path = ''
      if (route.path === '/' && path_prefix === '/') {
         new_path = '/'
      }
      else if (route.path === '/' || path_prefix === '/') {
         new_path = `${path_prefix}${route.path}`
      }
      else {
         new_path = `${path_prefix}/${route.path}`
      }
      
      const match_route = {
         ...route, 
         path: new_path
      }
      const match = matchPath(path, match_route) 
      if (match) {
         const cleaned_route = {
            ...route, 
            data: {
               ...(collection.route || {}).data, 
               ...route.data, 
            }
         }
         delete cleaned_route.children

         const new_collection = {
            params: {
               ...collection.params, 
               ...match.params, 
            }, 
            routes: [
               ...(collection.routes || []), 
               cleaned_route, 
            ],
            route: cleaned_route, 
         }
   
         return helper(path, route.children, new_path, new_collection)
      }

   }

   console.warn(`The given path ${path} isn't in route tree`)
   return collection

}