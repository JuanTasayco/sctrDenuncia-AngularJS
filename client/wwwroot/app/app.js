define([
  'constants',
  'angular',
    'routesHome',
    'helper',
    'system',
    'linqjs',
    'mDirective',
    'oim_theme_service',
    'originSystem'
], function(constants, angular, routesHome, helper, system, Enumerable) {
    var appHome = angular.module('appHome', ['ui.router',
        'oc.lazyLoad',
        'oim.oc.lazyload',
        'oim.layout',
        'mapfre.controls',
        'oim.theme.service',
        'ui.bootstrap',
        'origin.system'
    ]);

    appHome.config(['$stateProvider', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider', 'objectSystemConfiguration', 'accessSupplierProvider',
        function($stateProvider, $ocLazyLoadProvider, mServiceState, $urlRouterProvider, objectSystemConfiguration, accessSupplier) {
            $ocLazyLoadProvider.config({
                debug: false,
                loadedModules: ['appHome'],
            });
            objectSystemConfiguration.allowInjectProfile = true;
            mServiceState.appends(routesHome, function(state) {
                accessSupplier.$get().applyResolve(state);
            });

            $urlRouterProvider.otherwise("/")
        }
      ])
      .run(['$rootScope', 'originSystemFactory', 'mapfreAuthetication',
        function($rootScope, originSystemFactory, mapfreAuthetication) {
          $rootScope.$on('$stateChangeStart', function(event) {
            if (!originSystemFactory.isOriginSystem(constants.ORIGIN_SYSTEMS.oim.code)) {
              event.preventDefault();
              mapfreAuthetication.goHome();
            }
        });
      }]);
})
