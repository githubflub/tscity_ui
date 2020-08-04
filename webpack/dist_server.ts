import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpack_config from './webpack_config'

const PORT = +process.env.LOCAL_BUILD_PORT || 7171
const wat = webpack(webpack_config)


const webpack_dev_server_options = {
   contentBase: 'dist',
   writeToDisk: true,
   compress: true,
   publicPath: webpack_config.output.publicPath,
   // This is needed otherwise you can't refresh locally on
   // routes other than '/'. You'll get a cannot GET error
   historyApiFallback: true,
}

const server = new WebpackDevServer(wat, webpack_dev_server_options)

server.listen(PORT, 'localhost', function(error) {
   if (error) {
      console.log(error)
   }

   console.log(`WebpackDevServer is live at localhost:${PORT}`)
})