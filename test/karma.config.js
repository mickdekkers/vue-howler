var webpackConfig = require('../config/dev');

delete webpackConfig.entry

module.exports = function (config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['mocha', 'chai'],
    reporters: ['mocha'],
    files: [
        './index.js',
    ],
    plugins: [
        'karma-chrome-launcher',
        'karma-chai',
        'karma-mocha',
        'karma-webpack',
        'karma-mocha-reporter',
        'karma-chrome-launcher',
        'karma-sourcemap-loader'
    ],
    preprocessors: {
        './index.js': ['webpack', 'sourcemap']
    },
    webpack: {
      devtool: 'inline-source-map',
      entry: './test/index.js',
      output: {
        path: __dirname,
        filename: 'test-bundle.js'
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
              retainLines: true,
              presets: ['es2015']
            },
            exclude: /node_modules/
          }
        ]
      }
    },
    webpackMiddleware: {
        noInfo: true
    },
    browserNoActivityTimeout: 30000,
    restartOnFileChange: true
  });
};
