'use strict';

require.config({
  waitSeconds: 0,
  paths: {
    redefineMod:          './redefineMod',
    angularElastic:      '../scripts/angular-elastic/elastic',
    bootstrap:            '../scripts/bootstrap/dist/js/bootstrap.min',
    lodash:               '../scripts/lodash/dist/lodash.min',
    jquery:               '../scripts/jquery/dist/jquery.min',
    angular:              '/scripts/b_components/angular/angular.min',
    'angular-messages':   '../scripts/angular-messages/angular-messages.min',
    'ui.router':          '/scripts/b_components/angular-ui-router/release/angular-ui-router.min',
    async:                '../scripts/requirejs-plugins/src/async',
    domReady:             '../scripts/domReady/domReady',
    'rx-angular':         '../scripts/rx-angular/dist/rx.angular.min',
    rx:                   '../scripts/rxjs/dist/rx.lite.min',
    'rx-time':            '../scripts/rxjs/dist/rx.time.min',
    'rxjs-dom':           '../scripts/rxjs-dom/dist/rx.dom.compat',
    restangular:          '../scripts/restangular/dist/restangular.min',
    'ng-map':             '../scripts/ngmap/build/scripts/ng-map.min',
    bloodhound:           '../scripts/typeahead.js/dist/bloodhound.min',
    typeahead:            '../scripts/typeahead.js/dist/typeahead.jquery.min',
    'angular-typeahead':  '../scripts/angular-typeahead/dist/angular-typeahead.min',
    'checklist-model':    '../scripts/checklist-model/checklist-model',
    angularLocalStorage:  '../scripts/angular-local-storage/dist/angular-local-storage.min',
    bindonce:             '../scripts/angular-bindonce/bindonce.min',
    angularDatepicker:    '../scripts/angular-mighty-datepicker/build/angular-mighty-datepicker',
    'angular-dynamic-locale': '../scripts/angular-dynamic-locale/dist/tmhDynamicLocale.min',
    dompurify:            '../scripts/DOMPurify/dist/purify.min',
    system:               '/system',
    mapModule:            './util/map-module',
    common:               './util/common-module',
    refTemplate:          './templates',
    statesCP:             './clientesProveedores/states',
    statesR:              './registro/states',
    statesRep:            './reportes/states',
    paginate:             './util/paginate',
    coreServices:         './panel/service/core-services',
    coreConstants:        './panel/service/core-constants',
    polyfillIE:           './util/polyfillIE',
    msgModal:             './panel/component/msgModal',
    referenciaApp:        './app'
  },
  shim: {
    lodash: {
      exports: '_'
    },
    jquery: {
      exports: '$'
    },
    typeahead: {
      deps:                 ['jquery'],
      init: function($) {
        return require.s.contexts._.registry['typeahead.js'].factory($);
      }
    },
    moment: {
      exports: 'moment'
    },
    'ui-select': {
      exports: 'ui-select'
    },
    angularDatepicker: {
      deps: ['angular', 'bindonce', 'moment'],
      init: function() {
        require(['moment'], function(m) {
          window.moment = m; // eslint-disable-line
        });
      }
    },
    bloodhound: {
      deps:                 ['jquery'],
      exports:              'Bloodhound'
    },
    angular: {
      'exports':            'angular',
      'deps':               ['polyfillIE', 'redefineMod', 'jquery' , 'rx', 'lodash']
    },
    'angular-messages':     ['angular'],
    'angular_sanitize':     ['angular'],
    bindonce:               ['angular', 'moment'],
    angularLocalStorage:    ['angular'],
    'checklist-model':      ['angular'],
    'angular-typeahead':    ['angular', 'typeahead', 'bloodhound'],
    'angular-dynamic-locale': ['angular'],
    referenciaApp:          ['angular', 'domReady', 'angular_animate', 'bootstrap', 'ui.router','angular_ocLazyLoad',
      'system', 'rx-angular', 'restangular', 'refTemplate', 'statesCP', 'statesR',
      'statesRep', 'common', 'angular-typeahead', 'checklist-model', 'angularLocalStorage',
      'coreServices', 'coreConstants', 'msgModal', 'angular-messages',
      'angular_sanitize', 'angular-dynamic-locale'],
    'ui.router':            ['angular'],
    ocLazyLoad:             ['angular'],
    restangular:            ['lodash', 'angular'],
    'rx-angular':           ['angular'],
    'rxjs-dom':             ['rx-time'],
    'angular-animate':      ['angular']
  },
  packages: [{
    name: 'moment',
    location: '../scripts/moment',
    main: 'moment'
  }],
  priority:                 ['redefineMod', 'jquery', 'rx', 'angular']
});

require([
  'require', 'angular', 'system', 'jquery', 'coreServices', 'polyfillIE'
], function(require, ng, system, $, coreServices) {

  system.currentApp = system.apps.drabap;

  system.import(
    [system.lib.package,
      system.apps.home
    ],
    function(mainPackage) {
      function bootstrapApp(result) {
        coreServices.setMasterData(result);
        require(['domReady!', mainPackage.lib.constants.name, 'referenciaApp'], function(document) {
          require(['topController', 'footerController', 'headerController', 'bottomController'], function() {},
          function() {
            console.error('Error while trying to retry request!'); // eslint-disable-line
          });
          ng.bootstrap(document, ['referenciaApp']);
        });
      }
      $.ajax({
        url: 'https://oim.pre.mapfre.com.pe/oim_referencia/api/proveedores/filtros',
        // este servicio a veces suele demorar en responder, por eso el lapso alto
        timeout: 63000,
        beforeSend: function(xhr) {
          var authorizationToken = 'Bearer ' + window.localStorage[coreServices.jsonTokenName];  // eslint-disable-line
          xhr.setRequestHeader('Authorization', authorizationToken);
        }
      })
      .done(function doneFn(result) {
        bootstrapApp(result);
      })
      .fail(function failFn(error) {
        console.log(error);  // eslint-disable-line
        bootstrapApp(void 0);
      });
    });

});
