define([
  'constants',
  'constantsPericial',
  'mocksPericial',
  'angular',
  'pericial_routes',
  'angular_route',
  'angular_ocLazyLoad',
  'angular_ui_route',
  // 'gaia',
  'oim_ocLazyLoad',
  'oim_theme_service',
  'oim_commons',
  'mDirective',
  'gPerDirective',
  'mMainServices',
  'uiSelect',
  'helper',
  'angular_messages',
  'ui-mask',
  // 'fileSaver',  'chartjs'], function (constants, constantsPericial, mocksPericial, angular, app_routes, angular_route) {
  'fileSaver', 'chart','localStorageService'], function (constants, constantsPericial, mocksPericial, angular, app_routes, angular_route) {

  var baseUrl = "";
  // create new module appPericial
  var appPericial = angular.module('appPericial',
    ['ngRoute',
      'oc.lazyLoad',
      'ui.router',
      // 'gaiafrontend',
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
      'oim.security.authorization',
      'oim.proxyService.gper',
      'oim.proxyService.poliza',
      'oim.proxyService.Login',
      'ui.bootstrap.pagination',
      'ui.bootstrap.tabs',
      'ui.mask',
      'oim.wrap.gaia.httpSrv',
      'ui.bootstrap.popover',
     // 'chart.js',
      'gPer.module',
      'oim.proxyService.webProc',
      'LocalStorageModule'
    ])
    .config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider',
      function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider){
        $ocLazyLoadProvider.config({
            debug:true,
            suppressBootstrapWarning: true,
            loadedModules: ['appPericial']
        });
        objectSystemConfiguration.allowInjectProfile = true;
        objectSystemConfiguration.allowAccessPrivileges = true;
        mServiceState.appends(app_routes, function(state){
            accessSupplier.$get().applyResolve(state);
        });
        $urlRouterProvider.otherwise("/");

	   }])
    .run(['$rootScope','oimProgress', '$route', '$location', '$anchorScroll',
     function($rootScope,oimProgress, $route, $location, $anchorScroll){


        $rootScope.$on('$stateChangeStart', function() {
            oimProgress.start();
            // $anchorScroll();
        });
        $rootScope.$on('$stateChangeSuccess', function() {
          if ($rootScope.cancelSpin !== true){
            oimProgress.end();
          }
          $anchorScroll();
        });

        $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
          $rootScope.actualLocation = $location.path();
        });


    }])

});

