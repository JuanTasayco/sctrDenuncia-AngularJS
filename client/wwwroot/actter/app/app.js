'use strict';

define([
  'angular',
  'appRoutes',
  'constants',
  'generalConstant',
  'angular_messages',
  'angular_ocLazyLoad',
  'angular_route',
  'angular_ui_route',
  'oim_ocLazyLoad',
  'helper',
  'mDirective',
  'mMainServices',
  'oim_commons',
  'oim_theme_service',
  'ui-mask',
  'uiSelect',
  'mxPaginador'
], function(angular, appRoutes, constants, generalConstant) {
  ConfigFn.$inject = [
    '$ocLazyLoadProvider',
    '$stateProvider',
    '$urlRouterProvider',
    'accessSupplierProvider',
    'mServiceStateProvider',
    'objectSystemConfiguration'
  ];

  function ConfigFn(
    $ocLazyLoadProvider,
    $stateProvider,
    $urlRouterProvider,
    accessSupplier,
    mServiceState,
    objectSystemConfiguration
  ) {
    $ocLazyLoadProvider.config({
      debug: false,
      suppressBootstrapWarning: true,
      loadedModules: [generalConstant.APP_MODULE]
    });
    objectSystemConfiguration.allowInjectProfile = true;
    objectSystemConfiguration.allowAccessPrivileges = true;
    mServiceState.appends(appRoutes, function(state) {
      accessSupplier.$get().applyResolve(state);
    });
    $urlRouterProvider.otherwise('/');
  }

  runFn.$inject = ['$rootScope','oimProgress', '$route', '$location','$state','oimAbstractFactory'];
  
    function runFn($rootScope,oimProgress, $route, $location,$state,oimAbstractFactory) {

      //Estilos MyDream
      oimAbstractFactory.applyStylesMyDream();

      $rootScope.$on('$stateChangeStart', function() {
        oimProgress.start();
      });

      $rootScope.$on('$stateChangeSuccess', function() {
        $rootScope.cancelSpin || oimProgress.end();
      });

      $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
      });

      $rootScope.$on('$stateChangeError', function(){ 
        $rootScope.cancelSpin || oimProgress.end();
        $state.go('home')
      })
    }

  return angular
    .module(generalConstant.APP_MODULE, [
      'ngRoute',
      'ui.router',
      'oc.lazyLoad',
      'mapfre.controls',
      'mapfre.mainServices',
      'ngAnimate',
      'ngSanitize',
      'oim.commons',
      'oim.layout',
      'oim.oc.lazyload',
      'oim.proxyService.Login',
      'oim.security.authorization',
      'oim.theme.service',
      'ui.bootstrap',
      'ui.mask',
      'ui.select',
      'oim.wrap.gaia.httpSrv',
      'oim.theme.service',
    ])
    .config(ConfigFn)
      .run(runFn);
});
