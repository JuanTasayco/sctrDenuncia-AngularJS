define([
  'constants',
  'angular',
  'nsctr_routes',
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
  'ui-mask',
  'oimGoogleAnalytics',
  'fileSaver',
  'lodash'], function (constants, require, app_routes, angular_route) {

  var baseUrl = "";
  // create new module appNsctr
  var appNsctr = angular.module('appNsctr',
    ['ngRoute',
      'oc.lazyLoad',
      'ui.router',
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
      'oim.proxyService.nsctr',
      'oim.proxyService.Login',
      'ui.bootstrap.pagination',
      'ui.bootstrap.tabs',
      'ui.mask',
      'oim.wrap.gaia.httpSrv',
      'ui.bootstrap.popover',
      'ui.bootstrap.dropdown',
      'nsctr.security',
      'oim.google.analytics',
      'oim.commons'
    ]);

    helper.setTitleByOrigin(window.localStorage['appOrigin'], 'NSCTR');

    appNsctr.config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider',
      function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider){
        $ocLazyLoadProvider.config({
            debug:false,
            suppressBootstrapWarning: true,
            loadedModules: ['appNsctr']
        });
        objectSystemConfiguration.allowInjectProfile = true;
        objectSystemConfiguration.allowAccessPrivileges = true;
        mServiceState.appends(app_routes, function(state){
            accessSupplier.$get().applyResolve(state);
        });
        $urlRouterProvider.otherwise("/");

	   }]).run(['$rootScope','oimProgress', 'oimAbstractFactory', '$location', '$anchorScroll', 'nsctrAuthorize', '$state',
     function($rootScope, oimProgress, oimAbstractFactory, $location, $anchorScroll, nsctrAuthorize, $state){

       // Estilos myDream
       oimAbstractFactory.applyStylesMyDream();

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
          oimProgress.start();
          if (!nsctrAuthorize.isAuthorized(toState, toParams)) {
            event.preventDefault();
            $state.go('accessDenied');
          }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {
          if ($rootScope.cancelSpin !== true) oimProgress.end();
          $anchorScroll();
        });

        $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
          $rootScope.actualLocation = $location.path();
        });

    }])

});
