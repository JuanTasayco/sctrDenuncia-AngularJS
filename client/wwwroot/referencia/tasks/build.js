'use strict'

import gulp from 'gulp'
import fs from 'fs'
import Q from 'q'
import mustache from 'mustache'
import argv from 'yargs'
import runSequence from 'run-sequence'

const myargs = argv.argv,
 envJson = (fs.existsSync('./env.json') && require(process.cwd() + '/env.json')) || {}

gulp.task('buildAppTemplate', () => {
  return readFile(process.cwd() + '/src/app.tpl', 'utf8')
    .then(generateAppJsFromTemplate)
    .then(writeAppJSFile)
})

gulp.task('buildMainTemplate', () => {
  return readFile(process.cwd() + '/src/main.tpl', 'utf8')
    .then(generateMainJsFromTemplate)
    .then(writeMainJSFile)
})

gulp.task('build', (cb) => {
  // info('Starting Building Referencia App....')
  return runSequence('clean', 'sass', 'html', 'js', cb)
})

function generateAppJsFromTemplate(fileData) {
  let data = fileData.data;
  //   customTags = [ '<%', '%>' ];
  // mustache.parse(data, customTags);

  let deferred = Q.defer(),
    viewData = {
      'production': myargs.env === 'prod' ? true : false,
      'apiUrl': getApiUrl(myargs.env),
      'oim': myargs.oim ? true : false,
      'locale': '{{locale}}'
    },
    output = mustache.render(data, viewData)
  deferred.resolve(output)
  return deferred.promise
}

function getApiUrl(env) {
  return (envJson[env] || envJson.prod).apiUrl;
}

function generateMainJsFromTemplate(fileData) {
  let data = fileData.data,
    deferred = Q.defer(),
    viewData = {
      'production': myargs.env === 'prod' ? true : false,
      'apiUrl': getApiUrl(myargs.env)
    },
    output = mustache.render(data, viewData)
  deferred.resolve(output)
  return deferred.promise
}

function readFile(fileName, encoding) {
  let returnedObject = {}, deferred = Q.defer()
  fs.readFile(fileName, encoding, (err, data) => {
    if (err) {
      returnedObject.err = err
      deferred.reject(returnedObject)
    } else {
      returnedObject.data = data
      deferred.resolve(returnedObject)
    }
  })
  return deferred.promise
}

function writeFile(fileName, data, encoding, callback) {
  let deferred = Q.defer()
  fs.writeFile(fileName, data, encoding, (err, data) => {
    if (err) {
      deferred.reject(err)
    } else {
      deferred.resolve(true)
    }
  })
  return deferred.promise.nodeify(callback)
}

function writeAppJSFile(data) {
  return writeFile(process.cwd() + '/src/app.js', data, 'utf8')
}

function writeMainJSFile(data) {
  return writeFile(process.cwd() + '/src/main.js', data, 'utf8')
}
