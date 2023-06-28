'use strict';

define(['require', 'angular', 'rx', 'jquery', 'coreServices', 'coreConstants','statesCP', 'statesR', 'statesRep',
  'moment','uIBootstrap', 'oim_layout', 'oim_theme_service', 'mDirective', 'rxjs-dom', 'angularElastic', 'uiSelect'],
  function(require, ng, Rx, $, coreServices, coreConstants, statescp, statesr, statesrep, moment, angularElastic) {
    configFn.$inject = ['$stateProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', '$ocLazyLoadProvider',
      'localStorageServiceProvider', 'RestangularProvider', '$compileProvider', '$httpProvider', '$logProvider',
      'accessSupplierProvider', 'objectSystemConfiguration', 'tmhDynamicLocaleProvider'
    ];

    function configFn($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $ocLazyLoadProvider,
      localStorageServiceProvider, RestangularProvider, $compileProvider, $httpProvider, $logProvider,
      accessSupplierProvider, objectSystemConfiguration, tmhDynamicLocaleProvider
      ) {
      var locale = 'es';
      moment.locale(locale);
      require(['moment/locale/' + locale]);
      tmhDynamicLocaleProvider.defaultLocale(locale + '-pe');
      tmhDynamicLocaleProvider.localeLocationPattern('scripts/angular-i18n/angular-locale_{{locale}}.js');


      // oim integration - maybe it is not needed becauase we are adding the resolves in the abstract root state
      // without any validation as it is done in the resolve
      objectSystemConfiguration.allowInjectProfile = true;
      objectSystemConfiguration.allowAccessPrivileges = true;

      var apiUrl = 'https://oim.pre.mapfre.com.pe/oim_referencia/api';
      RestangularProvider.setBaseUrl(apiUrl);

      $urlMatcherFactoryProvider.caseInsensitive(true);
      $ocLazyLoadProvider.config({
        loadedModules: ['referenciaApp'],
        jsLoader: require
      });

      localStorageServiceProvider
        .setPrefix('registroReferenciaModule')
        .setStorageType('sessionStorage');

      var appMainState = {
        name: 'referencia',
        abstract: true,
        url: '',
        data: {
          version: '1.0.0-rc.2'
        },
        resolve: {
          oimClaims: ['accessSupplier', function asFn(accessSupplier) {
            return accessSupplier.GetProfile(); // eslint-disable-line
          }],
          authorizedResource: ['accessSupplier', function arFn(accessSupplier) {
            return accessSupplier.getAllObject();
          }],
          absDependencies: ['$ocLazyLoad', '$log',function($ocLazyLoad, $log) {
            return $ocLazyLoad.load({
              serie: true,
              files: [
                // 'js!topController', 'js!footerController', 'js!headerController', 'js!bottomController',
                '/referencia/app/panel/service/core-services.js',
                '/referencia/app/clientesProveedores/service/cliente-services.js'
              ]
            }).then(
              function() {
                $log.info('load file successfully');
              },
              function(error) {
                $log.error('error loading the file ........' + error);
              });
          }]
        }
      };

      ng.abap = {
        version: appMainState.data.version
      };

      var panelState = {
        name: 'referencia.panel',
        url: '/panel',
        views: {
          'top@': {
            templateUrl: '/app/index/controller/template/top.html',
            controller: 'topController'
          },
          'header@': {
            templateUrl: '/app/index/controller/template/header.html',
            controller: 'headerController'
          },
          'footer@': {
            templateUrl: '/app/index/controller/template/footer.html',
            controller: 'footerController'
          },
          'bottom@': {
            templateUrl: '/app/index/controller/template/bottom.html',
            controllerProvider: 'bottomController'
          },
          'content@': {
            templateUrl: '/referencia/app/panel/controller/index.html',
            controller: 'panelRController as $ctrl'
          }
        },
        resolve: {
          parentDependencies: ['$ocLazyLoad', '$log', 'absDependencies', function($ocLazyLoad, $log) {
            return $ocLazyLoad.load({
              files: [
                '/referencia/app/panel/controller/panel-controller.js',
                '/referencia/app/panel/component/mapaClientes.js',
                '/referencia/app/panel/component/loader.js',
                '/referencia/app/panel/component/mfinput.js',
                '/referencia/app/panel/component/btnFilter.js',
                '/referencia/app/registro/component/registroComponents.js',
                '/referencia/app/panel/component/error500.js',
                '/referencia/app/panel/component/breadcrumb.js',
                '/referencia/app/core/pageHeader/pageHeader.js'
              ]
            }).then(
              function() {
                $log.info('load file successfully');
              },
              function(error) {
                $log.error('error loading the file ........' + error);
              });
          }]
        }
      };

      var mapaClienteState = {
        name: 'referencia.panel.clientes',
        url: '/clientes?:lvl&:pl&:cambio',
        views: {
          'content@': {
            templateUrl: '/referencia/app/clientesProveedores/controller/mapaCliente.html',
            controller: 'mapaClienteController as $ctrl'
          }
        },
        resolve: {
          dependencies: ['$ocLazyLoad', '$log', 'parentDependencies', function reDeFn($ocLazyLoad, $log) {
            return $ocLazyLoad.load({
              files: ['/referencia/app/clientesProveedores/controller/mapaCliente-controller.js']
            }).then(
              function() {
                $log.info('load files successfully ......');
              },
              function(error) {
                $log.error('error loading the files ........' + error);
              });
          }],
          dataClientes: ['dependencies', 'panelService', '$rootScope', function reClFn(dependencies, panelService,
            $rootScope) {
            if ($rootScope.transitionState === this.name) {
              return panelService.getClientes();
            }
            return {};
          }]
        }
      };

      var mapaProveedoresState = {
        name: 'referencia.panel.proveedores',
        url: '/proveedores',
        params: {
          lvl: null,
          pl: null,
          cambio: null
        },
        views: {
          'content@': {
            templateUrl: '/referencia/app/clientesProveedores/controller/mapaProveedores.html',
            controller: 'mapaProveedoresController as $ctrl'
          }
        },
        resolve: {
          dependencies: ['$ocLazyLoad', '$log', 'parentDependencies', function reDeFn($ocLazyLoad, $log) {
            return $ocLazyLoad.load({
              serie: true,
              files: [
                '/referencia/app/clientesProveedores/controller/mapaProveedores-controller.js'
              ]
            }).then(
              function() {
                $log.info('load files successfully .... ');
              },
              function(error) {
                $log.error('error loading the files ........' + error);
              });
          }],
          dataProveedores: ['dependencies', 'panelService', '$rootScope', function reClFn(dependencies, panelService,
            $rootScope) {
            if ($rootScope.transitionState === this.name) {
              return panelService.getProveedores();
            }
            return {};
          }]
        }
      };

      var registroState = {
        name: 'referencia.panel.registro',
        url: '/registro',
        abstract: true,
        resolve: {
          regDependencies: ['$ocLazyLoad', '$log', 'parentDependencies', function reDeFn($ocLazyLoad, $log) {
            return $ocLazyLoad.load({
              serie: true,
              files: [
                '/referencia/app/registro/service/registros-services.js'
              ]
            }).then(
              function() {
                $log.info('load files successfully .... ');
              },
              function(error) {
                $log.error('error loading the files ........' + error);
              });
          }]
        }
      };

      var errorState = {
        name: 'referencia.panel.error',
        url: '/',
        params: {
          transitionState: null
        },
        views: {
          'content@': {
            templateUrl: '/referencia/app/panel/component/error500.html',
            controller: 'ErrorController as $ctrl'
          }
        }
      };

      $stateProvider.state(appMainState)
        .state(panelState)
        .state(mapaClienteState)
        .state(mapaProveedoresState)
        .state(registroState)
        .state(errorState);

      statescp.registerStates($stateProvider);
      statesr.registerStates($stateProvider);
      statesrep.registerStates($stateProvider);
    }

    runFn.$inject = ['$state', '$rootScope', '$log', '$auth', '$window'];

    function runFn($state, $rootScope, $log, $auth, $window) {
      var unRegOn = $rootScope.$on('onBackendError', function() {
        $state.go('referencia.panel.error', {transitionState: $rootScope.transitionState});
      });

      var unregisterFn = $rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from) {
        $rootScope.previousState = from.name;
        $rootScope.currentState = to.name;
        $log.info('Previous state:' + $rootScope.previousState);
        $log.info('Current state:' + $rootScope.currentState);
      });

      var unregisterFn2 = $rootScope.$on('$stateChangeStart', function(ev, to) {
        if (!coreServices.getMasterData() &&  $rootScope.backendError) {
          $rootScope.$emit('onBackendError');
          if (to !== 'referencia.panel') {
            ev.preventDefault();
          }
        }
        if (!$auth.isAuthenticated()) {
          ev.preventDefault();
          $window.location.href = '/';
        }
        $rootScope.transitionState = to.name;
      });

      $rootScope.$on('$destroy', function() {
        unregisterFn();
        unregisterFn2();
        unRegOn();
      });

      if (!coreServices.getMasterData()) {
        $state.go('referencia.panel.error', {}, {reload: true});
      } else {
        $state.go('referencia.panel');
      }
    }

    coreDataServiceFn.$inject = [];

    function coreDataServiceFn() {
      return coreServices;
    }

    decoratorLogFn.$inject = ['$provide', '$logProvider'];

    function decoratorLogFn($provide, $logProvider) {
      logDecoratorFn.$inject = ['$delegate'];

      function logDecoratorFn($delegate) {
        var origLog = $delegate.log,
          origInfo = $delegate.info,
          origWarn = $delegate.warn,
          origError = $delegate.error,
          origDebug = $delegate.debug;

        function curryIt(methodFn) {
          return function() {
            var args = [].slice.call(arguments);
            args[0] = ['DrAbap::' + new Date().toString(), '::', args[0]].join('');
            if ($logProvider.debugEnabled()) {
              methodFn.apply(null, args);
            }
          };
        }

        $delegate.log = curryIt(origLog);
        $delegate.info = curryIt(origInfo);
        $delegate.warn = curryIt(origWarn);
        $delegate.error = curryIt(origError);
        $delegate.debug = curryIt(origDebug);

        return $delegate;
      }

      $provide.decorator('$log', logDecoratorFn);
    }

    runIdleFn.$inject = ['$window', '$log', '$timeout', 'mapfreAuthetication', 'accessSupplier', '$uibModal',
      '$rootScope', '$locale'];

    function runIdleFn($window, $log, $timeout, mapfreAuthetication, accessSupplier, $uibModal, $rootScope, $locale) {
      $log.info('Lenguaje cargado: ' + $locale.id);
      var mergedStreams = Rx.Observable.merge(
        Rx.DOM.click($window.document),
        Rx.DOM.keydown($window.document),
        Rx.DOM.scroll($window.document)
      );
      if (('ontouchstart' in $window && 'ontouchstart' in $window.document.documentElement)
        || $window.DocumentTouch && $window.document instanceof DocumentTouch) {  // eslint-disable-line
        mergedStreams = Rx.Observable.merge(mergedStreams, Rx.DOM.mousemove($window.document));
      }
      //  after 9 min of inactivitiy, app shows a confirmation popup
      var timeInSeconds = 9 * 60;
      var idleStream = mergedStreams
        .bufferWithTime(timeInSeconds * 1000)
        .filter(function(arr) {
          return arr.length === 0;
        })
        .pausable();

      idleStream.subscribeOnNext(
        function sonFn() {
          idleStream.pause();
          //  after the idle confirmation popup appears, we have 1 min. before the session ends
          //  automatically
          var timeoutPromise = $timeout(function loFn() {
            accessSupplier.clean();
            mapfreAuthetication.goLoginPage();
          }, 60 * 1000);
          confirmSessionModal(timeoutPromise);
        });

      idleStream.resume();
      function confirmSessionModal(cancelTmFn) {
        var modalInstance = $uibModal.open({
          backdrop: true,
          backdropClick: true,
          dialogFade: true,
          animation: true,
          keyboard: true,
          scope: $rootScope,
          size: 'lg',
          windowTopClass: 'modal-msg fade',
          template: '<modalmsg close="close()" save="continuar()" options="options"></modalmsg>',
          controller: ['$scope', '$uibModalInstance', function(scope, $uibModalInstance) {
            scope.close = function() {
              $timeout.cancel(cancelTmFn);
              $log.info('Usuario desea salir');
              mapfreAuthetication.signOut().then(function soFn() {
                accessSupplier.clean();
                mapfreAuthetication.goLoginPage();
              });
              $uibModalInstance.close();
            };

            scope.continuar = function() {
              $timeout.cancel(cancelTmFn);
              idleStream.resume();
              $uibModalInstance.close();
            };

            scope.options = {};
            scope.options.title = '¿Estás seguro que deseas continuar?';
            scope.options.subtitle = 'Una vez terminada la sesion, tendrás que logearte de nuevo';
            scope.options.type = 'confirm';
            scope.options.saveTxt = 'Continuar';
            scope.options.cancelTxt = 'Salir';
          }]  // end controller
        }); // end modalInstance
        modalInstance.result.then(function() {}, function() {});
      }

    } // end runIdleFn

    return ng.module('referenciaApp', ['ngAnimate', 'ngSanitize', 'ngMessages', 'ui.router', 'ui.bootstrap', 'rx',
      'oim.layout', 'oc.lazyLoad', 'restangular', 'templateApp', 'CommonReferenciaModule', 'siyfion.sfTypeahead',
      'checklist-model', 'LocalStorageModule', 'oim.proxyService.Login', 'oim.security.authorization',
      'oim.theme.service', 'referenciaModalApp', 'tmh.dynamicLocale', 'mapfre.controls', 'monospaced.elastic',
      'ui.select'
    ]).config(configFn)
      .config(decoratorLogFn)
      .run(runFn)
      .run(runIdleFn)
      .service('coreDataService', coreDataServiceFn)
      .constant('staticData', coreConstants);
  });
