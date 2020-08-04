process.env.NODE_ENV = 'production'

import webpack from 'webpack'
import webpack_config from './webpack_config'
import chalk from 'chalk'


webpack(webpack_config).run((error, result) => {
   if (error) {
      console.log(chalk.red(error.toString()))
      return 1;
   }

   const stats = result.toJson()
   // console.log(`Webpack stats:`, stats)

   if (Array.isArray(stats.errors) && stats.errors.length) {
      return stats.errors.map((error: any) => console.log(chalk.red(error)))
   }

   if (stats.warnings) {
      console.log(chalk.yellow("Webpack WARNINGS"))
      stats.warnings.map(warning => console.log(chalk.yellow(warning)))
   }


   console.log(chalk.green('Your app is compiled in production mode in /dist. It\'s ready to roll!'));

   return 0;
})