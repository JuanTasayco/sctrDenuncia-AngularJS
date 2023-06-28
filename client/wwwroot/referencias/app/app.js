(function ($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "appReferencias", ['angular', 'referenciasRoutes', 'uiSelect', 'localStorageService'],
  function (angular, app_routes) {
    angular.module('referencias.app', ['ngRoute',
      'oc.lazyLoad',
      'ui.router',
      'ngAnimate',
      'ngSanitize',
      'ui.bootstrap',
      'ui.bootstrap.carousel',
      'oim.oc.lazyload',
      'oim.theme.service',
      'oim.layout',
      'oim.commons',
      'mapfre.controls',
      'ui.bootstrap.modal',
      'oim.proxyService.Login',
      'ui.bootstrap.pagination',
      'oim.proxyService.referencias',
      'novit.referencias.templates',
      'referencias.security',
      'ui.select', 'ngSanitize',
      'LocalStorageModule',
      'siyfion.sfTypeahead',
    ])
      .config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider',
        function ($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider) {
          $ocLazyLoadProvider.config({
            debug: false,
            suppressBootstrapWarning: true,
            loadedModules: ['referencias.app']
          });
          objectSystemConfiguration.urlHome = '/referencias/#/'
          objectSystemConfiguration.allowInjectProfile = true;
          objectSystemConfiguration.allowAccessPrivileges = false;
          objectSystemConfiguration.allowAuthorization = false;
          mServiceState.appends(app_routes, function (state) {
            accessSupplier.$get().applyResolve(state);
          });
          $urlRouterProvider.otherwise("/");

        }]).run(['$rootScope','$state','referenciasAuthorize','$timeout', function($rootScope,$state,referenciasAuthorize,$timeout) {
          referenciasAuthorize.isAuthorized().then(
            function(response){
              if(!response){
                $timeout(function() {
                  $state.go('accessdenied')
                });
              }
            },function(error) {
              $timeout(function() {
                $state.go('accessdenied')
              });
            } 
          )

          $rootScope.$on('$stateChangeSuccess', function(event) {
            if(referenciasAuthorize.accessDenied()){
              event.preventDefault();
              $state.go('accessdenied')
            }
          });
      }]);
  });