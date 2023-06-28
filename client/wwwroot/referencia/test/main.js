'use strict';
var allTestFiles = [];
var TEST_REGEXP = /spec\.js$/;

var pathToModule = function(path) {
  var newPath = path.replace(/^\/base\//, '../').replace(/\.js$/, '');
  console.log('Printing out old path : ' + path);
  console.log('Printing out new path : ' + newPath);
  // console.log('Printing out the allTestFiles : ' + allTestFiles.toString());
  return newPath;
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    if (file.indexOf('scripts') === -1) {
      console.log('Pushing file to Module: ' + file);
      allTestFiles.push(pathToModule(file));
    }
  }
});

require.config({
  baseUrl: '/base/src',
  waitSeconds: 2,
  paths: {
    'redefineMod': './redefineMod',
    'angular': '../scripts/angular/angular',
    'angularMocks': '../scripts/angular-mocks/angular-mocks',
    'bootstrap': '/scripts/b_components/bootstrap/dist/js/bootstrap.min',
    'ui.router': '/scripts/b_components/angular-ui-router/release/angular-ui-router',
    'ocLazyLoad': '/scripts/b_components/oclazyload/dist/ocLazyLoad.require',
    'angular-animate': '/scripts/b_components/angular-animate/angular-animate',
    'domReady': '../scripts/domReady/domReady',
    'rx-angular': '../scripts/rx-angular/dist/rx.angular',
    'rx': '../scripts/rxjs/dist/rx.all',
    'restangular': '../scripts/restangular/dist/restangular.min',
    'angular-maphilight': '../scripts/angular-maphilight/lib/angular.maphilight',
    'system': '/system',
    'refTemplate': './templates',
    'referenciaApp': './app'
  },
  shim: {
    'angular': {
      'exports': 'angular',
      'deps': ['redefineMod', 'rx']
    },
    'angularMocks': {
      deps: ['angular'],
      'exports': 'angular.mock'
    },
    'referenciaApp': ['angular', 'domReady', 'angular-animate', 'angular-maphilight', 'bootstrap', 'ui.router',
      'ocLazyLoad', 'system', 'rx-angular', 'restangular'
    ],
    'ui.router': ['angular'],
    'ocLazyLoad': ['angular'],
    'restangular': ['lodash', 'angular'],
    'rx-angular': ['angular'],
    'angular-animate': ['angular']
  },
  priority: ['redefineMod', 'rx', 'angular'],

  deps: allTestFiles,
  callback: window.__karma__.start
});
