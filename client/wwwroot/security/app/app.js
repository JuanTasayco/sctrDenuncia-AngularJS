define([
  'constants',
  'angular',
  'security_routes',
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
  'fileSaver',
  'proxySeguridad',
  'mxPaginador',
  'uiTree'
  ], function (constants, require, app_routes, angular_route) {

  var baseUrl = "";
  // create new module appSecurity
  var appSecurity = angular.module('appSecurity',
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
      'oim.proxyService.Login',
      'ui.bootstrap.pagination',
      'ui.bootstrap.tabs',
      'ui.mask',
      'oim.wrap.gaia.httpSrv',
      'ui.bootstrap.popover',
      'oim.commons',
      'oim.proxyService.seguridad',
      'ui.tree'
    ]);

    appSecurity.config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider',
      function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider){
        $ocLazyLoadProvider.config({
            debug:true,
            suppressBootstrapWarning: true,
            loadedModules: ['appSecurity']
        });
        objectSystemConfiguration.allowInjectProfile = true;
        objectSystemConfiguration.allowAccessPrivileges = true;
        mServiceState.appends(app_routes, function(state){
            accessSupplier.$get().applyResolve(state);
        });
        $urlRouterProvider.otherwise("/");

	   }]).run(['$rootScope','oimProgress', '$route', '$location', '$anchorScroll', '$window',
     function($rootScope,oimProgress, $route, $location, $anchorScroll, $window){

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

        function accessSecurity(){
          var a = 0;
          if (localStorage.getItem('evoProfile')) {
            var profile = JSON.parse(localStorage.getItem('evoProfile'));
            var items = profile.rolesCode
            items.filter(function(item) {
              if(item.nombreAplicacion === "SEGURIDAD") a = 1
            })[0];
            return a;
          }
        }

        var access = accessSecurity();
        if(access == 0) $window.location.href = '/';
    }])

});

