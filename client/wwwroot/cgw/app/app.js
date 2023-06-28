define([
  'angular',
  'cgw_routes',
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
  'localStorageService',
  'ngQuill',
  'mMainServices'
  ],
  function(ng, app_routes, angular_route) {

    configFn.$inject = ['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider',
    'mServiceStateProvider', '$urlRouterProvider'];

    function configFn($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState,
    $urlRouterProvider) {
      $ocLazyLoadProvider.config({
        debug: true,
        suppressBootstrapWarning: true,
        loadedModules: ['appCgw']
      });

      objectSystemConfiguration.allowInjectProfile = true;
      objectSystemConfiguration.allowAccessPrivileges = true;
      mServiceState.appends(app_routes, function(state) {
        accessSupplier.$get().applyResolve(state);
      });
      $urlRouterProvider.otherwise('/');
    }

    runFn.$inject = ['$rootScope','oimProgress', '$route', '$location'];

    function runFn($rootScope,oimProgress, $route, $location) {
      $rootScope.$on('$stateChangeStart', function() {
        oimProgress.start();
      });

      $rootScope.$on('$stateChangeSuccess', function() {
        $rootScope.cancelSpin || oimProgress.end();
      });

      $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
      });
    }

    return ng.module('appCgw', [
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
      'oim.proxyService.poliza',
      'oim.proxyService.Login',
      'oim.proxyService.cgw',
      'oim.proxyService.powereps',
      'oim.security.authorization',
      'ui.bootstrap.pagination',
      'ui.bootstrap.tabs',
      'oim.commons',
      'LocalStorageModule',
      'ngQuill',
      'mapfre.mainServices'
    ]).config(configFn)
      .run(runFn);
  }
);
