(function($root, name, deps, action) {
    
    $root.define(name, deps, action);
    })(window, "appSctrDenuncia", ['angular', 'sctrDenunciaRoutes', 'uiSelect', 'mMainServices'],
      function(angular, app_routes) {
        angular.module('sctrDenuncia.app', ['ngRoute',
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
            'oim.proxyService.sctrDenuncia',
            'novit.sctrDenuncia.templates',
            'ui.select', 'ngSanitize', 'mapfre.mainServices'
          ])
          .config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider', 
          function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider) {
            $ocLazyLoadProvider.config({
              debug: false,
              suppressBootstrapWarning: true,
              loadedModules: ['sctrDenuncia.app']
            });
            objectSystemConfiguration.urlHome = '/sctrDenuncia/#/'
            objectSystemConfiguration.allowInjectProfile = true;
            objectSystemConfiguration.allowAccessPrivileges = true;
            mServiceState.appends(app_routes, function(state) {
              accessSupplier.$get().applyResolve(state);
            });
            $urlRouterProvider.otherwise("/");
    
          }])
          .run(['accessSupplier', 'mpSpin', function(accessSupplier, mpSpin){
            accessSupplier.GetProfile()
            .then(function(data){
                if(data.userSubType === '2'){
                    mpSpin.start();
                    window.location.href = "#/complaintnew"
                }
            })
        }])
          
    
      });