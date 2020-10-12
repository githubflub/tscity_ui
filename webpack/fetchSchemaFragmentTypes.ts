function fetchSchemaFragmentTypes() {
   const fetch = require('node-fetch');
   const fs = require('fs');

   // const fragment_write_location = './webpack/schema.graphql'
   const fragment_write_location = './src/apollo/fragment_types.json'

   const fetch_request = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'authorization': 'lurkertoken' },
      body: JSON.stringify({
      query: `
         {
            __schema {
               types {
                  kind
                  name
                  possibleTypes {
                     name
                  }
               }
            }
         }
      `,
      })
   }

   const API_URL_LOCAL = process.env.API_URL_LOCAL
   const API_URL = process.env.API_URL

   if (!API_URL_LOCAL && !API_URL) {
      throw new Error('No API_URL_LOCAL or API_URL. Did you forget to load your environment variables?')
   }

   return Promise.resolve()
      .then(() => {
         console.log(`Fetching schema from local API at ${API_URL_LOCAL}`)
         return fetch(API_URL_LOCAL, fetch_request)
      })
      .catch(error => {
         if (error.code === 'ECONNREFUSED') {
            console.log(`Couldn't reach local API. Trying live API at ${API_URL}`);
            return fetch(API_URL, fetch_request)
         }
         else {
            console.error("Local API fetch error: ", error)
            throw error;
         }
      })
      .catch(error => {
         console.error("Couldn't reach live API.", error);
         throw error;
      })
      .then(fetch_result => fetch_result.json())
      .then(fetch_result => {
         console.log('fetch_result', fetch_result)
         const { data, errors, message } = fetch_result
         if (errors || message === 'Unauthorized') {
            console.error(errors)
            throw new Error(`Found your endpoint, but couldn't get gql schema`)
         }

         // https://www.apollographql.com/docs/react/data/fragments/#defining-possibletypes-manually
         const possible_types = {};
         data.__schema.types.forEach(supertype => {
            if (supertype.possibleTypes) {
               possible_types[supertype.name] =
                  supertype.possibleTypes.map(subtype => subtype.name);
            }
         })

         console.log("possible_types", possible_types);

         // Write schema to a file. u_u
         return new Promise((resolve, reject) => {
            fs.writeFile(fragment_write_location, JSON.stringify(possible_types), error => {
               if (error) {
                  reject(error)
               }

               console.log("Successfully wrote fragmentTypes.json to", fragment_write_location);
               resolve()
            })
         })
      })
      .catch(error => {
         console.error("There was an error writing your schema to a file...")
         throw error
      })

}

fetchSchemaFragmentTypes()