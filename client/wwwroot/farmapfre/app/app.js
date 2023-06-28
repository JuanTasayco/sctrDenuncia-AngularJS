(function($root, name, deps, action) {
    
    $root.define(name, deps, action);
    })(window, "appFarmapfre", ['angular', 'farmapfreRoutes', 'uiSelect'],
      function(angular, app_routes) {
        angular.module('farmapfre.app', ['ngRoute',
            'oc.lazyLoad',
            'ui.router',
            'ngAnimate',
            'ngSanitize',
            'ui.bootstrap',
            // 'ui.bootstrap.carousel',
            'oim.oc.lazyload',
            'oim.theme.service',
            'oim.layout',
            'oim.commons',
            'mapfre.controls',
            'ui.bootstrap.modal',
            'oim.proxyService.Login',
            'ui.bootstrap.pagination',
            'oim.proxyService.farmapfre',
            'novit.farmapfre.templates',
            'ui.select'/* , 'ngSanitize' */
          ])
          .config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider', 'uibDatepickerConfig', 
          function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider, uibDatepickerConfig) {
            $ocLazyLoadProvider.config({
              debug: false,
              suppressBootstrapWarning: true,
              loadedModules: ['farmapfre.app']
            });
            objectSystemConfiguration.urlHome = '/farmapfre/#/'
            objectSystemConfiguration.allowInjectProfile = true;
            objectSystemConfiguration.allowAccessPrivileges = false;
            objectSystemConfiguration.allowAuthorization = false;
            
            mServiceState.appends(app_routes, function(state) {
              accessSupplier.$get().applyResolve(state);
            });

            $urlRouterProvider.otherwise("/");

            uibDatepickerConfig.showWeeks = false;
          }]);
      });