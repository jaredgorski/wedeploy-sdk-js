/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of Liferay, Inc. nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

const babelPresetMetal = require('babel-preset-metal');
const babelPresetResolveSource = require('babel-preset-metal-resolve-source');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const isparta = require('isparta');
const mocha = require('gulp-mocha');
const nodeExternals = require('webpack-node-externals');
const replace = require('gulp-replace');
const request = require('request-promise-native');
const runSequence = require('run-sequence');
const Server = require('karma').Server;
const webpack = require('webpack');

const release = process.env.NODE_ENV === 'production';

const plugins = [];
const watch = process.env.WATCH === 'true';
let apiSuffix = '';
let sourceMap = 'inline-source-map';

const sauceLabsBrowsers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
  },
  sl_safari_9: {
    base: 'SauceLabs',
    browserName: 'safari',
    version: '9',
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
  },
  sl_ie_10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '10',
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11',
  },
  sl_edge_20: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'Windows 10',
    version: '13',
  },
  sl_edge_21: {
    base: 'SauceLabs',
    browserName: 'microsoftedge',
    platform: 'Windows 10',
    version: '14',
  },
  sl_iphone: {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.10',
    version: '9.3',
  },
  sl_android_4: {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '4.4',
  },
  sl_android_5: {
    base: 'SauceLabs',
    browserName: 'android',
    platform: 'Linux',
    version: '5.0',
  },
};

const babelOptions = {
  presets: [babelPresetResolveSource, babelPresetMetal],
  sourceMap: 'both',
};

const babelConfigCoverage = {
  frameworks: ['mocha', 'chai', 'sinon', 'source-map-support', 'browserify'],

  files: [
    'src/**/!(node)/*.js',
    'test/environment/browser/env.js',
    'test/**/*.js',
  ],

  exclude: ['src/env/node.js', 'test/**/node/**/*.js'],

  preprocessors: {
    'src/**/!(node)/*.js': ['browserify'],
    'node_modules/metal/src/**/*.js': ['browserify'],
    'node_modules/metal-*/src/**/*.js': ['browserify'],
    'test/environment/browser/env.js': ['browserify'],
    'test/**/*.js': ['browserify'],
  },

  browserify: {
    debug: true,
    transform: [
      [
        'babelify',
        {
          plugins: ['istanbul'],
          presets: ['env'],
        },
      ],
    ],
  },
};

const babelConfigKarma = {
  frameworks: ['mocha', 'chai', 'sinon', 'source-map-support', 'browserify'],

  files: [
    'src/**/!(node)/*.js',
    'test/environment/browser/env.js',
    'test/**/*.js',
  ],

  exclude: ['src/env/node.js', 'test/**/node/**/*.js'],

  preprocessors: {
    'src/**/!(node)/*.js': ['browserify'],
    'node_modules/metal/src/**/*.js': ['browserify'],
    'node_modules/metal-*/src/**/*.js': ['browserify'],
    'test/environment/browser/env.js': ['browserify'],
    'test/**/*.js': ['browserify'],
  },

  browserify: {
    debug: true,
    transform: [
      [
        'babelify',
        {
          presets: ['env'],
        },
      ],
    ],
  },
};

if (release) {
  plugins.push(new webpack.optimize.UglifyJsPlugin());
  apiSuffix = '-min';
  sourceMap = false;
}

gulp.task('build:browser', function() {
  const webpackConfig = {
    devtool: sourceMap,
    entry: {
      browser: './src/env/browser.js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['env', {modules: false}], 'es2015'],
            },
          },
        },
      ],
    },
    plugins: plugins,
    output: {
      filename: `build/browser/api${apiSuffix}.js`,
      libraryTarget: 'umd',
    },
  };

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        const output = stats.toString({
          colors: true,
          chunks: false,
        });
        console.log(output);
        resolve(output);
      }
    });
  });
});

gulp.task('build:node', function() {
  const webpackConfig = {
    devtool: sourceMap,
    entry: {
      node: './src/env/node.js',
    },
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [['env', {modules: false}], 'es2015'],
            },
          },
        },
      ],
    },
    plugins: plugins,
    output: {
      filename: `build/node/api${apiSuffix}.js`,
      libraryTarget: 'commonjs2',
    },
    target: 'node',
  };

  return new Promise((resolve, reject) => {
    webpack(webpackConfig, (error, stats) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        const output = stats.toString({
          colors: true,
          chunks: false,
        });
        resolve(output);
      }
    });
  });
});

gulp.task('clear', function() {
  return del(['build']);
});

gulp.task('build', function(done) {
  runSequence(
    'clear',
    ['lint', 'build:browser', 'build:node'],
    'patch-socket.io',
    done
  );
});

/* eslint-disable no-console,require-jsdoc */
gulp.task('ci', function(done) {
  return runSequence('lint', 'test:saucelabs', 'test:node', done);
});

gulp.task('build:watch', ['build'], function() {
  gulp.watch(['src/**/*', 'test/**/*'], ['build']);
});

gulp.task('lint', function() {
  return gulp
    .src(['src/**/*.js', 'test/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('patch-socket.io', function() {
  return gulp
    .src([`build/browser/api${apiSuffix}.js`])
    .pipe(replace('if (\'withCredentials\' in xhr) {', 'if (false) {'))
    .pipe(gulp.dest('build/browser'));
});

gulp.task('test', function(done) {
  runSequence('test:browser', 'test:node', done);
});

gulp.task('test:browser', function(done) {
  const config = Object.assign({}, babelConfigKarma, {
    browsers: ['Chrome'],

    singleRun: !watch,
  });

  new Server(config, done).start();
});

gulp.task('test:coverage', function(done) {
  const config = Object.assign({}, babelConfigCoverage, {
    browsers: ['Chrome'],

    reporters: ['coverage', 'progress'],

    coverageReporter: {
      instrumenters: {isparta: isparta},
      instrumenter: {'**/*.js': 'isparta'},
      instrumenterOptions: {isparta: {babel: babelOptions}},
      reporters: [{type: 'lcov', subdir: 'lcov'}, {type: 'text-summary'}],
    },
  });

  new Server(config, done).start();
});

gulp.task('test:node', function() {
  return gulp
    .src(
      [
        'test/environment/node/env.js',
        'test/**/*.js',
        '!test/**/browser/**/*.js',
      ],
      {read: false}
    )
    .pipe(
      mocha({
        compilers: 'js:babel-core/register',
      })
    );
});

gulp.task('test:node:watch', ['test:node'], function() {
  gulp.watch(['src/**/*', 'test/**/*'], ['test:node']);
});

gulp.task('test:saucelabs', function(done) {
  let url = 'https://app-wedeploysdkjsjwt.wedeploy.io';

  if (process.env.TRAVIS_PULL_REQUEST) {
    url += '?pull_request=' + process.env.TRAVIS_PULL_REQUEST;
  }

  request(url).then(token => {
    const config = Object.assign({}, babelConfigKarma, {
      browsers: Object.keys(sauceLabsBrowsers),

      browserDisconnectTimeout: 10000,
      browserDisconnectTolerance: 2,
      browserNoActivityTimeout: 240000,

      captureTimeout: 240000,
      customLaunchers: sauceLabsBrowsers,

      reporters: ['dots', 'saucelabs'],

      sauceLabs: {
        accessKey: token,
        startConnect: true,
        tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER,
        username: 'wedeploy-sdk-js',
      },

      singleRun: true,
    });

    new Server(config, done).start();
  });
});
