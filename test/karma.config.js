var webpackConfig = require('../config/dev');
var path = require('path')

delete webpackConfig.entry

module.exports = function (config) {
  config.set({
    browsers: ['Chrome_with_vue_devtools'],
    frameworks: ['mocha', 'chai'],
    reporters: ['mocha'],
    files: [
        './index.js',
    ],
    plugins: [
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
          },
          {
            test: /\.vue$/,
            loader: 'vue-loader',
            exclude: /node_modules/
          }
        ]
      },
      resolve: {
        alias: {
          'vue-standalone': 'vue/dist/vue.common.js'
        }
      }
    },
    webpackMiddleware: {
        noInfo: true
    },
    browserNoActivityTimeout: 30000,
    restartOnFileChange: true,
    customLaunchers: {
      Chrome_with_vue_devtools: {
        base: 'Chrome',
        flags: ['--user-data-dir=' + path.join(__dirname, 'chrome')]
      }
    }
  });
};
