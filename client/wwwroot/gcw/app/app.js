'use strict';

define([
  'angular',
  'gcw_routes',
  'angular_route',
  'angular_ocLazyLoad',
  'angular_ui_route',
  'oim_ocLazyLoad',
  'oim_theme_service',
  'oim_commons',
  'mDirective',
  'uiSelect',
  'helper',
  'angular_messages',
  'fileSaver',
  'mxPaginador',
  'polizaServicePoliza',
  'ui-mask',
  'chart',
  'oimGoogleAnalytics',
  'mMainServices'
  ],
  function(ng, appRoutes) {

    helper.setTitleByOrigin(window.localStorage['appOrigin'], 'Consultas de Gestión');

    configFn.$inject = ['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider',
      'mServiceStateProvider', '$urlRouterProvider'];

    function configFn($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState,
    $urlRouterProvider) {
      $ocLazyLoadProvider.config({
        debug:false,
        suppressBootstrapWarning: true,
        loadedModules: ['appGcw']
      });

      objectSystemConfiguration.allowInjectProfile = true;
      objectSystemConfiguration.allowAccessPrivileges = true;
      mServiceState.appends(appRoutes, function(state) {
        accessSupplier.$get().applyResolve(state);
      });
      $urlRouterProvider.otherwise('/');
    }

    runFn.$inject = ['$rootScope','oimProgress', '$route', '$location', 'oimAbstractFactory'];

    function runFn($rootScope,oimProgress, $route, $location, oimAbstractFactory) {

      oimAbstractFactory.applyStylesMyDream();

      var stChStartFn = $rootScope.$on('$stateChangeStart', function() {
        oimProgress.start();
      });

      var stChSuccessFn = $rootScope.$on('$stateChangeSuccess', function() {
        $rootScope.cancelSpin || oimProgress.end();
      });

      var locChSuccessFn = $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
      });

      $rootScope.$on('$destroy', function() {
        stChStartFn();
        stChSuccessFn();
        locChSuccessFn();
      });

    }

    return ng.module('appGcw', [
      'ngRoute',
      'oc.lazyLoad',
      'ui.router',
      'ngAnimate',
      'ngSanitize',
      'ui.bootstrap',
      'oim.oc.lazyload',
      'oim.theme.service',
      'oim.layout',
      'mapfre.controls',
      'ui.bootstrap.modal',
      'ui.select',
      'oim.proxyService.Login',
      'oim.proxyService.gcw',
      'oim.security.authorization',
      'ui.bootstrap.pagination',
      'ui.bootstrap.tabs',
      'ui.mask',
      'oim.commons',
      'oim.proxyService.poliza',
      'oim.google.analytics',
      'mapfre.mainServices'
    ]).config(configFn)
      .run(runFn);
  }
);
