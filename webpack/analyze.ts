process.env.NODE_ENV = 'production';

import webpack from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import config from './webpack_config';

const PORT = +process.env.ANALYZER_URL_LOCAL_PORT || 9191;

config.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: PORT }));

const compiler = webpack(config);

compiler.run((error, stats) => {
  if (error) {
    throw new Error(error.toString());
  }

  console.log(stats); // eslint-disable-line no-console
});
