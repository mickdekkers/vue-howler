const _ = require('lodash')
const babelConfig = JSON.parse(
  require('fs').readFileSync(`${__dirname}/../.babelrc`)
)

/**
 * Headless Chrome setup
 */
const ChromiumRevision = require('puppeteer/package.json').puppeteer
  .chromium_revision
const Downloader = require('puppeteer/utils/ChromiumDownloader')
const revisionInfo = Downloader.revisionInfo(
  Downloader.currentPlatform(),
  ChromiumRevision
)

process.env.CHROMIUM_BIN = revisionInfo.executablePath

/**
 * Karma config
 */
module.exports = function(config) {
  config.set({
    // browsers: ['ChromiumHeadless'],
    browsers: ['Chrome'],

    frameworks: ['mocha'],

    // this is the entry file for all our tests.
    files: ['index.js'],

    // we will pass the entry file to webpack for bundling.
    preprocessors: {
      'index.js': ['webpack']
    },

    // use the webpack config
    webpack: {
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: _.assign(babelConfig, {
              babelrc: false,
              plugins: _.concat(
                _.without(babelConfig.plugins, 'external-helpers'),
                [
                  [
                    'fast-async',
                    {
                      useRuntimeModule: true,
                      compiler: {
                        promises: false
                      }
                    }
                  ]
                ]
              )
            })
          },
          {
            test: /\.mp3$/,
            loader: 'file-loader',
            options: {
              name: '[name]-[md5:hash:hex:7].[ext]'
            }
          }
        ]
      },
      resolve: {
        alias: {
          vue$: 'vue/dist/vue.esm.js'
        }
      },
      devtool: 'inline-source-map'
    },

    // avoid walls of useless text
    webpackMiddleware: {
      noInfo: true
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Concurrency level
    // how many browser should be started simultaneously
    concurrency: Infinity
  })
}
