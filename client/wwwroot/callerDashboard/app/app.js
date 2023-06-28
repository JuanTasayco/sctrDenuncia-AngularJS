(function($root, name, deps, action) {
  $root.define(name, deps, action);
})(window, "appCallerDashboard", ['angular', 'routesCallerDashboard'],
  function(angular, app_routes) {
    angular.module('oim.caller.dashboard', ['ngRoute',
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
        'oim.caller.monitor',
        'oim.caller.common',
        'oim.proxyService.callerDashboard',
        'oim.cdashboard.templates'
      ])
      .config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider', function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider) {
        $ocLazyLoadProvider.config({
          debug: true,
          suppressBootstrapWarning: true,
          loadedModules: ['oim.caller.dashboard ']
        });
        objectSystemConfiguration.allowInjectProfile = true;
        objectSystemConfiguration.allowAccessPrivileges = true;
        mServiceState.appends(app_routes, function(state) {
          accessSupplier.$get().applyResolve(state);
        });
        $urlRouterProvider.otherwise("/");

      }])
      .run(['$rootScope', 'oimPrincipal', function($rootScope, oimPrincipal) {
        function _showHeaderFooter(){
          var vResult = /usr_dashboard/g.test(oimPrincipal.getUsername().toLowerCase());
          return !vResult;
        }
        $rootScope.showHeaderFooter = _showHeaderFooter();
      }]);

  });