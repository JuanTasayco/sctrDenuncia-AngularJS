define(['angular',
  'callerDashboard_routes',
  'angular_route',
  'angular_ocLazyLoad',
  'angular_ui_route',
  // 'gaia',
  'oim_ocLazyLoad',
  'oim_theme_service',
  'oim_commons',
  'mDirective',
  'uiSelect',
  'helper',
  'angular_messages',
  'ui-mask',
  'fileSaver'], function (require, app_routes, angular_route) {

  var baseUrl = "";
  // create new module appCallerDashboard
  var appCallerDashboard = angular.module('appCallerDashboard',
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
      'ui.bootstrap.modal',
      'ui.select',
      // 'oim.proxyService.callerDashboard',
      // 'oim.proxyService.poliza',
      'oim.proxyService.Login',
      'ui.bootstrap.pagination',
      'ui.bootstrap.tabs',
      'ui.mask'
    ]);
    
    // appCallerDashboard.config(['$stateProvider', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider', function($stateProvider, $ocLazyLoadProvider, mServiceState, $urlRouterProvider){
    appCallerDashboard.config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider', function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider){
        $ocLazyLoadProvider.config({
            debug:true,
            suppressBootstrapWarning: true,
            loadedModules: ['appCallerDashboard']
        });
        objectSystemConfiguration.allowInjectProfile = true;
        objectSystemConfiguration.allowAccessPrivileges = true;
        mServiceState.appends(app_routes, function(state){
            accessSupplier.$get().applyResolve(state);
        });
        $urlRouterProvider.otherwise("/");
        
	   }]).run(['$rootScope','oimProgress', '$route', '$location', function($rootScope,oimProgress, $route, $location){ 
       
        $rootScope.$on('$stateChangeStart', function() {            
            oimProgress.start();
        });
        $rootScope.$on('$stateChangeSuccess', function() {
          if ($rootScope.cancelSpin !== true){
            oimProgress.end();
          }
        });
        
        $rootScope.$on('$locationChangeSuccess', function() {
            $rootScope.actualLocation = $location.path();
         });        
        
    }]);

     
});

