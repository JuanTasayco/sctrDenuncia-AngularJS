'use strict'

import gulp from 'gulp'
import connect from 'gulp-connect'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer from 'gulp-autoprefixer'
import ngAnnotate from 'gulp-ng-annotate'
import cleanCSS from 'gulp-clean-css'
import sass from 'gulp-sass'
import gutil from 'gulp-util'
import chalk from 'chalk'
import rename from 'gulp-rename'
import os from 'os'
import open from 'gulp-open'
import eslint from 'gulp-eslint'
import flow from 'gulp-flowtype'
import notify from 'gulp-notify'
import sassLint from 'gulp-sass-lint'
import htmlLint from 'gulp-html-lint'
import through from 'through'
import lazypipe from 'lazypipe'
import uglify from 'gulp-uglify'
import gulpif from 'gulp-if'
import runSequence from 'run-sequence'
import del from 'del'
import bourbon from 'node-bourbon'
import templateCache from 'gulp-angular-templatecache'
import browserSync from 'browser-sync'
import eslintThreshold from 'gulp-eslint-threshold'
import changed from 'gulp-changed'
import requireDir from 'require-dir'
import msg from 'gulp-messenger'
import argv from 'yargs'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

msg.init({
  logToFile: false,
  timestamp: true
});

msg.Info('Starting: ' + new Date());

requireDir('./tasks')

// const browsers = [
//   'android >= 4.4',
//   'bb >= 10',
//   'chrome >= 49',
//   'ff >= 40',
//   'ie >= 10',
//   'ie_mob >= 10',
//   'ios >= 7',
//   'opera >= 23',
//   'safari >= 7'
// ]
const autoprefixerOptions = {
    browsers: ['>1% in PE', 'last 2 versions']
  },
  SOURCE = './src/',
  DEST = './app/',
  info = logger.bind(null, 'info'),
  error = logger.bind(null, 'error'),
  myargs = argv.argv,
  uglifyOptions = {
    preserveComments: 'license',
    mangle: false
  };

let compressing = false,//myargs.env === 'prod' ? true : false,
  jsChannel = lazypipe()
  .pipe(eslint)
  .pipe(eslint.format)
  //.pipe(eslint.failAfterError)
  .pipe(() => {
    info('compressing JS? ' + compressing);
    return gulpif(compressing, uglify(uglifyOptions))
  })

gulp.task('html', () => {
  return gulp.src(['./src/**/*.html'])
    .pipe(gulp.dest(DEST))
    .pipe(browserSync.stream())
    // .pipe(connect.reload())
    /* .pipe(notify({
      onLast: true,
      message: function() {
        return 'HTML loaded!!!'
      }
    }))*/
})

gulp.task('lint:html', () => {
  return gulp.src(['./src/**/*.html'])
    .pipe(htmlLint())
    .pipe(htmlLint.format())
})

gulp.task('templateCache', () => {
  return gulp.src(['./src/**/*.html'])
    .pipe(templateCache('templates.js', {
      standalone: true,
      root: '/referencia/app/',
      module: 'templateApp'
    }))
    .pipe(browserSync.stream())
    // .pipe(connect.reload())
    .pipe(gulp.dest(DEST))
})

gulp.task('js', ['templateCache', 'buildAppTemplate', 'buildMainTemplate'], () => {
  return gulp.src('./src/**/*.js')
    .pipe(changed(DEST))
    .pipe(jsChannel())
    .pipe(
      ngAnnotate().on('error', notify.onError((error) => {
        gutil.beep();
        return 'JS  > Message to the notifier: ' + error.message
      })))
    .pipe(gulp.dest(DEST))
    // .pipe(connect.reload())
    .pipe(browserSync.stream())
  /*
    .pipe(notify({
      onLast: true,
      message: function() {
        return 'Javascript loaded!!!'
      }
    })) */
})

gulp.task('sass', ['lint:scss'], () => {
  const opStyle = myargs.env === 'prod' ? 'compressed' : 'expanded',
    input = 'src/scss/main.scss',
    sassOptions = {
      errLogToConsole: true,
      outputStyle: (opStyle),
      includePaths: bourbon.includePaths
    }

  return gulp.src(input)
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions)
      .on('error', notify.onError((error) => {
        //  sass.logError(error)
        return 'SASS > Message to the notifier: ' + error.message
      })))
    .pipe(gulpif(myargs.env !== 'prod', sourcemaps.write()))
    .pipe(autoprefixer(autoprefixerOptions))
    // .pipe(gulpif( myargs.env === 'prod' ,rename({
    .pipe(gulpif( true ,rename({
      suffix: '.min'
    })))
    .pipe(gulp.dest('styles/'))
    // .pipe(connect.reload())
    .pipe(browserSync.stream())
  /*
    .pipe(notify({
      onLast: true,
      message: function() {
        return 'Sass loaded!!!'
      }
    })) */
})

gulp.task('lint:scss', () => {
  return gulp.src(['src/scss/**/*.s+(a|c)ss', '!src/scss/core/**'])
    .pipe(sassLint({
      options: {
        configFile: '.sass-lint.yml'
      }
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
})

gulp.task('lint:js', () => {
  let thresholdWarnings = 7
  return gulp.src(['./src/**/*.js', '!node_modules/**'])
    .pipe(jsChannel())
    .pipe(eslintThreshold.afterWarnings(thresholdWarnings, (numberOfWarnings) => {
      throw new Error('ESLint warnings (' + numberOfWarnings + ') equal to or greater than the threshold (' +
        thresholdWarnings + ')')
    }))
})

gulp.task('flow', () => {
  return gulp.src(['./src/**/*.js', '!node_modules/**'])
    .pipe(flow({
      all: false,
      weak: true,
      killFlow: false,
      beep: true,
      abort: false
    }))
})

gulp.task('old', (cb) => {
  info('Starting Referencia App....')
    // return runSequence('clean', 'sass', 'html', 'lint', 'js', 'connect', 'watch', 'open', cb)
  return runSequence('clean', 'sass', 'html', 'js', 'browserSync', 'watch', cb)
})

gulp.task('default', (cb) => {
  info('Starting Referencia App....')
  return runSequence('clean', 'sass', 'html', 'js', 'browserSyncProxy', 'watch', cb)
})

gulp.task('httpProd', (cb) => {
  myargs.env = 'prod'
  info('Starting Referencia App without Ghost Mode ....')
  return runSequence('clean', 'sass', 'html', 'js', 'browserSyncNoGhost', cb)
})

gulp.task('inspect', (cb) => {
  info('Starting Referencia App with Inspector....')
    // return runSequence('clean', 'sass', 'html', 'lint', 'js', 'connect', 'watch', 'open', cb)
  return runSequence('clean', 'sass', 'html', 'js', ['browserSyncProxy', 'openInspector'], 'watch', cb)
})

gulp.task('http2', (cb) => {
  info('Starting Referencia App with HTTP/2 support....')
    // return runSequence('clean', 'sass', 'html', 'lint', 'js', 'connect', 'watch', 'open', cb)
  return runSequence('clean', 'sass', 'html', 'js', 'browserSyncHttp2', 'watch', cb)
})

gulp.task('connect', (cb) => {
  info('Starting Referencia App....')
  return runSequence('clean', 'sass', 'html', 'js', 'livereload', 'watch', 'open', cb)
})

gulp.task('clean', () => {
  info('Cleaning build files ...')
  return del.sync(['app', 'styles/*', 'src/app.js', 'src/main.js'], { dot: true })
})

gulp.task('build', ['clean'], (cb) => {
  info('Building Referencia App ....' + myargs.env)
  compressing = myargs.env === 'prod' ? true : false
  return runSequence('clean', 'js', 'sass', 'html', cb)
})

gulp.task('bower', () => {
  const bower = require('gulp-bower')
  return bower()
})

gulp.task('lint', (cb) => {
  msg.info('*** Linting JS & SCSS  & Style ***')
  return runSequence('lint:js', 'lint:scss', 'lint:style', cb);
})

gulp.task('test', () => {

  const KarmaServer = require('karma').Server,
    shell = require('shelljs')
    // create test/reports
  shell.mkdir('-p', './test/reports/coverage')
  shell.mkdir('-p', './test/reports/unit')

  // Temp fix for test cases causing errors for specific gulp tasks
  const disableTestForTheseTargets = ['default']

  // Stop node proces for test specific gulp tasks
  const stopNodeProcessTheseTargets = ['test'],
    nodeCommand = process.argv[2],
    runTest = disableTestForTheseTargets.indexOf(nodeCommand) < 0,
    endProcessHere = stopNodeProcessTheseTargets.indexOf(nodeCommand) >= 0,
    serverOptions = {
      configFile: __dirname + '/karma.conf.js'
    }

  const serverCallbackFunction = (exitCode) => {
    if (exitCode !== 0) {
      console.log('Test Case Failure with exitCode ' + exitCode)
      process.exit(exitCode)
    }

    /*
    if the commandline only specified "Test" then end the node process after
    testing is successfully completed.
    */
    if (endProcessHere) {
      console.log('Test Run Successfully Completed')
      process.exit(exitCode)
    }
  }

  if (runTest) {
    const server = new KarmaServer(serverOptions, serverCallbackFunction)
    server.on('browser_error', (browser, error) => {
      gutil.log(chalk.white.bgRed.bold('===============>   Error  <================'))
      console.dir(error)
    })

    server.on('run_complete', (browser, results) => {
      gutil.log(chalk.white.bgGreen.bold('===============>  Success  <================'))
      console.dir(results)
    })
    server.start()
  }
})

function logger(type, message) {
  type = type || 'info'
  if (type === 'info') {
    gutil.log(chalk.green(message))
  }
  if (type === 'error') {
    gutil.log(chalk.white.bgRed.bold(message))
  }
}

var reportError = (error) => {
  var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

  notify({
    title: 'Task Failed [' + error.plugin + ']',
    message: lineNumber + 'See console.',
    sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
  }).write(error);

  gutil.beep(); // Beep 'sosumi' again

  // Inspect the error object
  //console.log(error);

  // Easy error reporting
  //console.log(error.toString());

  // Pretty error reporting
  var report = '';
  var chalk = gutil.colors.white.bgRed;

  report += chalk('TASK:') + ' [' + error.plugin + ']\n';
  report += chalk('PROB:') + ' ' + error.message + '\n';
  if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
  if (error.fileName) { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
  error(report);

  // Prevent the 'watch' task from stopping
  this.emit('end');
}
