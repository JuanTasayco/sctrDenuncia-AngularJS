'use strict';
define([
  'angular',
  'reembolso_routes',
  'RootReducer',
  'angular_route',
  'angular_ocLazyLoad',
  'angular_ui_route',
  'oim_ocLazyLoad',
  'oim_theme_service',
  'oim_commons',
  'mDirective',
  'mMainServices',
  'uiSelect',
  'helper',
  'angular_messages',
  'checklist-model',
  'ui-mask',
  'moment',
  'fileSaver'
], function(ng, appRoutes, RootReducer) {
  configFn.$inject = [
    '$stateProvider',
    'accessSupplierProvider',
    'objectSystemConfiguration',
    '$ocLazyLoadProvider',
    'mServiceStateProvider',
    '$urlRouterProvider',
    '$ngReduxProvider'
  ];

  function configFn(
    $stateProvider,
    accessSupplier,
    objectSystemConfiguration,
    $ocLazyLoadProvider,
    mServiceState,
    $urlRouterProvider,
    $ngReduxProvider
  ) {
    $ocLazyLoadProvider.config({
      debug: false,
      suppressBootstrapWarning: true,
      loadedModules: ['appReembolso']
    });

    objectSystemConfiguration.allowInjectProfile = true;
    objectSystemConfiguration.allowAccessPrivileges = true;
    mServiceState.appends(appRoutes, function(state) {
      accessSupplier.$get().applyResolve(state);
    });
    $urlRouterProvider.otherwise('/');

    $ngReduxProvider.createStoreWith(RootReducer, []);
  }

  runFn.$inject = ['$rootScope', 'oimProgress', '$route', '$location'];

  function runFn($rootScope, oimProgress, $route, $location) {
    var stChStartFn = $rootScope.$on('$stateChangeStart', function() {
      oimProgress.start();
    });

    var stChSuccessFn = $rootScope.$on('$stateChangeSuccess', function() {
      $rootScope.cancelSpin || oimProgress.end();
    });

    var locChSuccessFn = $rootScope.$on('$locationChangeSuccess', function() {
      $rootScope.actualLocation = $location.path();
    });

    $rootScope.$on('$destroy', function destroy() {
      stChStartFn();
      stChSuccessFn();
      locChSuccessFn();
    });
  }
  // TODO: agregar 'oim.proxyService.wp' una vez haya backend
  return ng
    .module('appReembolso', [
      'ngRoute',
      'oc.lazyLoad',
      'ui.router',
      'ngRedux',
      'ngAnimate',
      'ngSanitize',
      'ui.bootstrap',
      'oim.oc.lazyload',
      'oim.theme.service',
      'oim.layout',
      'mapfre.controls',
      'mapfre.mainServices',
      'ui.bootstrap.modal',
      'ui.select',
      'oim.proxyService.Login',
      'oim.security.authorization',
      'ui.bootstrap.pagination',
      'ui.bootstrap.tabs',
      'ui.mask',
      'checklist-model',
      'oim.commons',
      'appReembolso.factory',
      'appReembolso.reServices'
    ])
    .config(configFn)
    .run(runFn);
});
