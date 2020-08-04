import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpack_config from './webpack_config'

// const HOST = '0.0.0.0'
const HOST = 'localhost'
const PORT = +process.env.SITE_URL_LOCAL_PORT || 8181
const wat = webpack(webpack_config)


const webpack_dev_server_options = {
   contentBase: './dist',
   publicPath: webpack_config.output.publicPath,
   // This is needed otherwise you can't refresh locally on
   // routes other than '/'. You'll get a cannot GET error
   historyApiFallback: true,

   hot: true,
   watchOptions: {
      ignored: [/node_modules\/(?!@tscity)/]
   }
}

const server = new WebpackDevServer(wat, webpack_dev_server_options)

server.listen(PORT, HOST, function(error) {
   if (error) {
      console.log(error)
   }

   console.log(`WebpackDevServer is live at localhost:${PORT}`)
})