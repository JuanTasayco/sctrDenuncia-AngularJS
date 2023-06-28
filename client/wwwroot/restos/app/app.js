define([
  'constants',
  'angular',
  'restos_routes',
  'angular_route',
  'angular_ocLazyLoad',
  'angular_ui_route',
  // 'gaia',
  'oim_ocLazyLoad',
  'oim_theme_service',
  'oim_commons',
  'mDirective',
  'mMainServices',
  'uiSelect',
  'helper',
  'angular_messages',
  'ui-mask',
  'angular_base64_upload',
  'fileSaver'], function (constants, require, app_routes, angular_route) {

  var baseUrl = "";
  // create new module appRestos
  var appRestos = angular.module('appRestos',
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
      // 'oim.proxyService.nsctr',
      // 'oim.proxyService.poliza',
      'oim.proxyService.Login',
      'ui.bootstrap.pagination',
      'ui.bootstrap.tabs',
      'ui.mask',
      'oim.wrap.gaia.httpSrv',
      'ui.bootstrap.popover',
      'naif.base64'
    ]);

    // appRestos.config(['$stateProvider', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider', function($stateProvider, $ocLazyLoadProvider, mServiceState, $urlRouterProvider){
    appRestos.config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider',
      function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider){
        $ocLazyLoadProvider.config({
            debug:true,
            suppressBootstrapWarning: true,
            loadedModules: ['appRestos']
        });
        objectSystemConfiguration.allowInjectProfile = true;
        objectSystemConfiguration.allowAccessPrivileges = true;
        mServiceState.appends(app_routes, function(state){
            accessSupplier.$get().applyResolve(state);
        });
        $urlRouterProvider.otherwise("/");

	   }]).run(['$rootScope','oimProgress', '$route', '$location', '$anchorScroll',
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

