(function($root, name, deps, action) {    
  $root.define(name, deps, action);
})(window, "appKpissalud", ['angular', 'kpissaludRoutes', 'uiSelect', 'localStorageService'],
  function(angular, app_routes) {
    angular.module('kpissalud.app', ['ngRoute',
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
      'oim.proxyService.kpissalud',
      'oim.constants.kpissalud',
      'novit.kpissalud.templates',
      'ui.select', 'ngSanitize',
      'LocalStorageModule'
    ])
    .config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider', 
    function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider) {
      $ocLazyLoadProvider.config({
        debug: false,
        suppressBootstrapWarning: true,
        loadedModules: ['kpissalud.app']
      });
      objectSystemConfiguration.urlHome = '/kpissalud/#/'
      objectSystemConfiguration.allowInjectProfile = true;
      objectSystemConfiguration.allowAccessPrivileges = false;
      objectSystemConfiguration.allowAuthorization = false;
      mServiceState.appends(app_routes, function(state) {
        accessSupplier.$get().applyResolve(state);
      });
      $urlRouterProvider.otherwise("/");

    }]);
});