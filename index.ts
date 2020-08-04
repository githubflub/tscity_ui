import * as path from 'path';
import * as fs from 'fs';


process.on("SIGINT", function() {
   process.exit(0); 
}); 

const NODE_ENV = process.env.NODE_ENV;
let script_path = path.resolve(`./webpack/${NODE_ENV}.ts`);

if (process.env.BUILD_ENV === 'local' && process.env.STACK_ENV === 'dev') {
   script_path = path.resolve('./webpack/dist_server.ts'); 
}

// synchronously check whether a file exists
if (!fs.existsSync(script_path)) {
   console.error(`index.ts: this file don't exists!!! ${script_path}`); 
   process.exit(1); 
}

import(script_path)
   .then(() => {
      console.log("script import worked!!!")
   })

