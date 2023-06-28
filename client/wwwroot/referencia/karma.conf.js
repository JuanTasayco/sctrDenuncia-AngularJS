module.exports = function(config) {
  var sourcePreprocessors = ['coverage'],
    isSingleRun = true,
    // lstBrowsers = ['SlimerJS', 'PhantomJS', 'Chrome', 'Safari', 'Firefox'];
    lstBrowsers = ['PhantomJS'];

  function isDebug(argument) {
    return argument === '--debug';
  }
  if (process.argv.some(isDebug)) {
    isSingleRun = false;
    sourcePreprocessors = [];
    lstBrowsers = ['Chrome'];
  }
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['requirejs', 'jasmine', 'jasmine-matchers'],

    // list of files / patterns to load in the browser
    files: [{
      pattern: '../scripts/**/*.js',
      included: false,
      watched: false
    }, {
      pattern: 'scripts/**/*.js',
      included: false,
      watched: false
    }, {
      pattern: 'src/**/*.html',
      included: false
    }, {
      pattern: 'test/unit/**/*.spec.js',
      included: false
    }, {
      pattern: 'src/**/*.js',
      included: false
    }, 'test/main.js'],
    // list of files to exclude
    exclude: [],

    plugins: [
      'karma-requirejs',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-safari-launcher',
      'karma-firefox-launcher',
      'karma-slimerjs-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-ng-html2js-preprocessor',
      'karma-junit-reporter',
      'karma-verbose-reporter',
      'karma-failed-reporter',
      'karma-jasmine-matchers'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.html': ['ng-html2js'],
      'src/**/*.js': sourcePreprocessors
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      prependPrefix: '/referencia/app/'
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'verbose', 'failed'],
    // reporters configuration for running tests within IntelliJ
    //reporters: [],

    //Check out   for other coverageReporter https://github.com/karma-runner/karma-coverage
    coverageReporter: {
      // specify a common output directory
      dir: 'test/reports',
      includeAllSources: true,
      check: {
        global: {
          statements: 1,
          branches: 0,
          functions: 1,
          lines: 1,
          excludes: [
            'src/app.js'
          ]
        },
        each: {
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0,
          excludes: [
            'src/app.js'
          ],
          overrides: {
            'example/component/**/*.js': {
              statements: 98
            }
          }
        }
      },
      reporters: [
        // reporters not supporting the `file` property
        {
          type: 'html',
          subdir: 'report-html'
        }, {
          type: 'lcov',
          subdir: 'report-lcov'
        },
        // reporters supporting the `file` property, use `subdir` to directly
        // output them in the `dir` directory
        {
          type: 'cobertura',
          subdir: '.',
          file: 'cobertura.xml'
        }, {
          type: 'lcovonly',
          subdir: '.',
          file: 'report-lcovonly.txt'
        }, {
          type: 'teamcity',
          subdir: '.',
          file: 'teamcity.txt'
        }, {
          type: 'text'
        }, {
          type: 'text-summary',
          subdir: '.',
          file: 'text-summary.txt'
        }
      ]
    },

    // dhtmlReporter: {
    //   'outputFile': '/test/reports/index.html',
    //   'exclusiveSections': true,
    //   'openReportInBrowser': false
    // },

    // web server port
    port: 9999,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_WARN,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS'],
    //browsers: ['Firefox'],
    // browsers: ['PhantomJS', 'Chrome'],
    browsers: lstBrowsers,

    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: isSingleRun,

    //Karma performance optimzations to hopefully help the test cases not randomly fail
    // if browser does not bootup/capture in 10 sec = 10000 ms disconnect
    captureTimeout: 60000, // it was already there

    //After initial connection, if connection is mysteriously lost how long to wait for browser reconnection
    browserDisconnectTimeout: 10000, //default is 2sec = 2000ms

    //How many time will Karma try to reconnect to a browser if it disconnects
    browserDisconnectTolerance: 5,

    //if during testing Karma does not receive any messages from the browser, disconnect
    browserNoActivityTimeout: 60000 //disconnect after waiting 6sec = 6000ms

  });
};
