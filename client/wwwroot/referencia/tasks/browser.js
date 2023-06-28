'use strict'

import gulp from 'gulp'
import browserSync from 'browser-sync'
import connect from 'gulp-connect'
import os from 'os'
import open from 'gulp-open'
import argv from 'yargs'
import url from 'url'
import proxy from 'proxy-middleware'
import compress from 'compression'

let optionsBS = {
  port: 8080,
  online: false,
  open: 'local',
  server: {
    baseDir: '../'
  },
  logLevel: 'debug',
  logPrefix: 'ReferenciaApp',
  browser: ['google chrome'],
  startPath: '/referencia/#/',
  middleware: function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'if-modified-since, Origin, X-Requested-With, Content-Type, Accept')
    next()
  }
}

let proxyOptions = url.parse('http://localhost:12000/');
proxyOptions.route = '/drabad/api/';

let optionsBSProxy = {
  port: 8080,
  online: false,
  open: 'local',
  server: {
    baseDir: '../',
    middleware: [proxy(proxyOptions), compress({level:9})]
  },
  logLevel: 'debug',
  logPrefix: 'ReferenciaApp',
  startPath: '/referencia/#/'
}

let optionsBSNoGhost = Object.assign({}, optionsBSProxy)
optionsBSNoGhost.ghostMode = false
optionsBSNoGhost.server = {
    baseDir: '../',
    middleware: [proxy(proxyOptions), compress({level:9})]
  }

const myargs = argv.argv

gulp.task('browserSync', (cb) => {
  return browserSync.init(optionsBS, cb)
})

gulp.task('browserSyncProxy', (cb) => {
  return browserSync.init(optionsBSProxy, cb)
})

gulp.task('browserSyncNoGhost', (cb) => {
  return browserSync.init(optionsBSNoGhost, cb)
})

gulp.task('browserSyncHttp2', (cb) => {
  optionsBSNoGhost['httpModule'] = 'http2'
  optionsBSNoGhost['https'] = true
  return browserSync.init(optionsBSNoGhost, cb)
})

gulp.task('livereload', () => {
  return connect.server({
    root: '../',
    livereload: true,
    fallback: '../referencia/index.html'
  })
})

gulp.task('watch', () => {
  gulp.watch(['./src/**/*.html', './*.html'], ['templateCache'])
  gulp.watch(['./src/**/*.js'], ['js'])
  gulp.watch(['./src/scss/**/*.scss'], ['sass'])
  gulp.watch(['./src/app.tpl'], ['buildAppTemplate'])
  gulp.watch(['./src/main.tpl'], ['buildMainTemplate'])
})

gulp.task('open', () => {
  const pbrowser = myargs['b'],
    browser = os.platform() === 'linux' ? 'google-chrome' : (
      os.platform() === 'darwin' ? 'google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox')),
    options = {
      uri: 'http://localhost:8080/referencia',
      app: pbrowser || browser
    }

  return gulp.src('./index.html')
    .pipe(open(options))
})

gulp.task('openInspector', () => {
  const pbrowser = myargs['b'],
    browser = os.platform() === 'linux' ? 'google-chrome' : (
      os.platform() === 'darwin' ? 'google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox')),
    options = {
      uri: 'http://127.0.0.1:7070/?ws=127.0.0.1:7070&port=5858',
      app: pbrowser || browser
    }
  return gulp.src(__filename)
    .pipe(open(options))
})
