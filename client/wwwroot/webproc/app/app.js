'use strict';

define(
  [
    'angular',
    'wp_routes',
    'RootReducer',
    'logger',
    'ngRaven',
    'constants',
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
    'checklist-model',
    'mxPaginador',
    'ui-mask',
    'mMainServices'
  ],
  function(ng, appRoutes, RootReducer, logger, ngRaven, constants) {
    ngRaven
      .config('https://05a6ba25531745bcb5add7b17f5c8841@sentry.io/1271399')
      .install();
    ngRaven.setEnvironment(constants.environment);

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
        loadedModules: ['appWp']
      });
      // TODO: para prod remover logger
      var reduxLogger = logger.createLogger({
        level: 'info',
        collapsed: true
      });

      objectSystemConfiguration.allowInjectProfile = true;
      objectSystemConfiguration.allowAccessPrivileges = true;
      mServiceState.appends(appRoutes, function(state) {
        accessSupplier.$get().applyResolve(state);
      });
      $urlRouterProvider.otherwise('/');
      // TODO: para prod remover middleware reduxLogger
      $ngReduxProvider.createStoreWith(RootReducer, [reduxLogger]);
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
      .module('appWp', [
        'ngRoute',
        'oc.lazyLoad',
        'ui.router',
        'ngRedux',
        'ngRaven',
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
        'oim.security.authorization',
        'ui.bootstrap.pagination',
        'ui.bootstrap.tabs',
        'ui.mask',
        'checklist-model',
        'oim.commons',
        'appWp.factory',
        'mapfre.mainServices'
      ])
      .config(configFn)
      .run(runFn);
  }
);
