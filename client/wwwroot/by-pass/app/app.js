define(['angular',
  'byPass_routes',
  'angular_route',
  'angular_ocLazyLoad',
  'angular_ui_route',
  'wrap_gaia',
  'oim_ocLazyLoad',
  'oim_theme_service',
  'mDirective',
  'helper',
  'oim_security',
  'originSystem'
], function (require, app_routes, angular_route) {

  // create new module appByPass
  var appByPass = angular.module('appByPass', ['ngRoute',
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'oim.oc.lazyload',
    'oim.theme.service',
    'mapfre.controls',
    'oim.security.authentication',
    'oim.security.authorization',
    'oim.wrap.gaia.httpSrv',
    'oim.wrap.gaia.cookieSrv',
    'origin.system'
  ]);

  appByPass.config(['$stateProvider', '$ocLazyLoadProvider', '$urlRouterProvider', 'objectSystemConfiguration', '$locationProvider', function ($stateProvider, $ocLazyLoadProvider, $urlRouterProvider, objectSystemConfiguration, $locationProvider) {
    objectSystemConfiguration.allowAuthorization = false;
    //Other version $ocLazyLoad
    $ocLazyLoadProvider.config({
      debug: true,
      loadedModules: ['appByPass'],
      //NOTES GC - IMPORTANT: resolve depends with require js
      // asyncLoader: require
    });
    for (var i = 0; i < app_routes.length; i++) {
      var value = app_routes[i];
      if (angular.isArray(value.urls)) {
        angular.forEach(value.urls, function (u, r) {
          var s = helper.clone(value);
          delete s.urls;
          if (typeof u === 'string') {
            s.url = u;
            $stateProvider.state(value.name, s);
          } else {
            s.url = u.url;
            s.params = u.params
            $stateProvider.state(u.name, s);
          }

        });
      } else {
        $stateProvider.state(value.name, value);
      }
    }

    $urlRouterProvider.otherwise("/");

  }]);

});
