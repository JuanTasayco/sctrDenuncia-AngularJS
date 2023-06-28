(function($root, name, deps, action) {    
  $root.define(name, deps, action);
})(window, "appAtencionsiniestrosagricola", ['angular', 'atencionsiniestrosagricolaRoutes', 'uiSelect', 'localStorageService'],
  function(angular, app_routes) {
    angular.module('atencionsiniestrosagricola.app', ['ngRoute',
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
      'oim.proxyService.atencionsiniestrosagricola',
      'oim.constants.atencionsiniestrosagricola',
      'novit.atencionsiniestrosagricola.templates',
      'ui.select', 'ngSanitize',
      'LocalStorageModule'
    ])
    .config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider', 
    function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider) {
      $ocLazyLoadProvider.config({
        debug: false,
        suppressBootstrapWarning: true,
        loadedModules: ['atencionsiniestrosagricola.app']
      });
      //AH001 //objectSystemConfiguration.urlHome = '/atencionsiniestrosagricola/#/'
      objectSystemConfiguration.allowInjectProfile = true;
      objectSystemConfiguration.allowAccessPrivileges = true; //AH001 //false;
      //objectSystemConfiguration.allowAuthorization = false;
      mServiceState.appends(app_routes, function(state) {
        accessSupplier.$get().applyResolve(state);
      });
      $urlRouterProvider.otherwise("/");
        }]).filter('dosDecimales', function () {
          return function (input) {
            return Math.round(input * 100) / 100;
          };
        }).filter('dosDecimalesFixed', function () {
          return function (input) {

            return parseFloat(input).toFixed(2);
          };
        });
});