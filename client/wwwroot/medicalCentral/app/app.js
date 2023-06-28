(function($root, name, deps, action) {
    
  $root.define(name, deps, action);
  })(window, "appMedicalCenter", ['angular', 'medicalCenterRoutes'],
    function(angular, app_routes) {
      angular.module('medicalCenter.app', ['ngRoute',
          'oc.lazyLoad',
          'ui.router',
          'ngAnimate',
          'ngSanitize',
          'ui.bootstrap',
          'oim.oc.lazyload',
          'oim.theme.service',
          'oim.layout',
          'oim.commons',
          'mapfre.controls',
          'ui.bootstrap.modal',
          'oim.proxyService.Login',
          'ui.bootstrap.pagination',
          'oim.proxyService.medicalCenter',
          'medicalCenter.app.common',
          'novit.medicalCenter.templates',
          'angularjs-dropdown-multiselect'
        ])
        .config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider', function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider) {
          $ocLazyLoadProvider.config({
            debug: false,
            suppressBootstrapWarning: true,
            loadedModules: ['medicalCenter.app']
          });
          objectSystemConfiguration.urlHome = '/medicalCentral/#/'
          objectSystemConfiguration.allowInjectProfile = true;
          objectSystemConfiguration.allowAccessPrivileges = false;
          objectSystemConfiguration.allowAuthorization = false;
          mServiceState.appends(app_routes, function(state) {
            accessSupplier.$get().applyResolve(state);
          });
          $urlRouterProvider.otherwise("/");
  
        }]);
  
    });