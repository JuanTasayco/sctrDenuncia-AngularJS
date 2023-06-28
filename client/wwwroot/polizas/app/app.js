define(['angular',
  'polize_routes',
  'angular_route',
  'angular_ocLazyLoad',
  'angular_ui_route',
  // 'gaia',
  'oim_ocLazyLoad',
  'oim_theme_service',
  'oim_commons',
  'mDirective',
  'mMainServices',
  'uiSelect',
  'helper',
  'quill',
  'ngQuill',
  'angular_messages',
  'ui-mask',
  'fileSaver',
  'mxPaginador',
  'oimGoogleAnalytics',
  'images-resizer',
  'signature',
  'signature-panel',
  'originSystem',
  'uiTree'
], function (angular, app_routes, angular_route) {

  helper.setTitleByOrigin(window.localStorage['appOrigin'], 'Pólizas');

  // create new module appAutos
  var appAutos = angular.module('appAutos',
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
      'mapfre.mainServices',
      'ui.bootstrap.modal',
      'ui.select',
      'ngQuill',
      'oim.proxyService.poliza',
      'oim.proxyService.nsctr',
      'oim.proxyService.Login',
      'ui.mask',
      'oim.commons',
      'oim.security.authorization',
      'oim.google.analytics',
      'images-resizer',
      'oim.proxyService.mydream',
      'origin.system'
    ]);

  // create new modules
  var appSalud = angular.module('appSalud', ['ui.tree']);
  var appClinicaDigital = angular.module('appClinicaDigital', []);

  var appSoat = angular.module('appPoliza', []);

  var appSoat = angular.module('appSoat', []);

  var appFola = angular.module('appFola', []);

  var appEpsEmpresa = angular.module('appEpsEmpresa', []);

  var appCompany = angular.module('appCompany', []);

  var appAccidentes = angular.module('appAccidentes', ['oim.google.analytics']);

  var appTransporte = angular.module('appTransportes',['ui.bootstrap.pagination', 'oim.commons', 'ngMessages' ]);

  var appVida = angular.module('appVida', ['ngMessages']);

  var apprrgg = angular.module('appRrgg',  ['ngMessages']);

  var appCartas = angular.module('appCartas', []);

  var appSepelio = angular.module('appSepelio',  ['ngMessages','sepelio.security']);

  var appSeguroviaje = angular.module('appSeguroviaje', ['oim.theme.service']);

  var appDeceso = angular.module('appDeceso', ['decesos.security']);

  appSepelio.run(['$rootScope','oimProgress', 'oimAbstractFactory', '$location', '$anchorScroll', 'mapfreAuthetication', '$state', 'sepelioAuthorize',
  function($rootScope, oimProgress, oimAbstractFactory, $location, $anchorScroll, mapfreAuthetication,  $state, sepelioAuthorize) {
    // Estilos myDream
    oimAbstractFactory.applyStylesMyDream();
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      oimProgress.start();
      if (toState.nombreCorto){
        if(!sepelioAuthorize.isAuthorized(toState.nombreCorto)){
          event.preventDefault();
          $state.go('accessdenied');
        }
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {
      if ($rootScope.cancelSpin !== true) oimProgress.end();
      $anchorScroll();
    });

    $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
      $rootScope.actualLocation = $location.path();
    });

  }]);

  appAutos.config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider',
    function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider){

        $ocLazyLoadProvider.config({
            debug:false,
            suppressBootstrapWarning: true,
            loadedModules: ['appAutos']
        });
        objectSystemConfiguration.allowInjectProfile = true;
        objectSystemConfiguration.allowAccessPrivileges = true;
        mServiceState.appends(app_routes, function(state){
            accessSupplier.$get().applyResolve(state);
        });
        $urlRouterProvider.otherwise("/");

    }]).run(['$rootScope','oimProgress', '$route', '$location', '$anchorScroll', 'oimAbstractFactory', 'originSystemFactory', 'mapfreAuthetication',
      function($rootScope, oimProgress, $route, $location, $anchorScroll, oimAbstractFactory, originSystemFactory, mapfreAuthetication) {
        // Estilos myDream
        oimAbstractFactory.applyStylesMyDream();

        $rootScope.$on('$stateChangeStart', function(event, toState) {
          oimProgress.start();
          // INFO: Validación clienteEmpresa
          if (toState.name === 'emisa' && originSystemFactory.isOriginSystem(constants.ORIGIN_SYSTEMS.selfService.code)) {
            event.preventDefault();
            mapfreAuthetication.goOtherSystemPage(constants.ORIGIN_SYSTEMS.selfService.apps);
          }
        });
        $rootScope.$on('$stateChangeSuccess', function() {
            if ($rootScope.cancelSpin !== true){
                oimProgress.end();
            }
            $anchorScroll();
        });

        $rootScope.$on('$locationChangeSuccess', function() {
            $rootScope.actualLocation = $location.path();
         });

    }]);

    appDeceso.run(['$rootScope','oimProgress', 'oimAbstractFactory', '$location', '$anchorScroll', 'mapfreAuthetication', '$state', 'decesoAuthorize',
    function($rootScope, oimProgress, oimAbstractFactory, $location, $anchorScroll, mapfreAuthetication,  $state, decesoAuthorize) {
      // Estilos myDream
      oimAbstractFactory.applyStylesMyDream();
      $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
        oimProgress.start();
        if (toState.nombreCorto){
          if(!decesoAuthorize.isAuthorized(toState.nombreCorto)){
            event.preventDefault();
            $state.go('accessdenied');
          }
        }
      });

      $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {
        if ($rootScope.cancelSpin !== true) oimProgress.end();
        $anchorScroll();
      });

      $rootScope.$on('$locationChangeSuccess', function(event, newUrl, oldUrl) {
        $rootScope.actualLocation = $location.path();
      });

  }]);

});
