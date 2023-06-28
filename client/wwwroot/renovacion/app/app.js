define(['angular',
  'renovacion_routes',
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

  // create new module appRenovacion
  var appReno = angular.module('appReno',
    [ 'ngRoute',
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
      'oim.proxyService.Login',
      'ui.mask',
      'oim.commons',
      'oim.security.authorization',
      'oim.google.analytics',
      'images-resizer',
      'oim.proxyService.mydream',
      'origin.system',
      'oim.proxyService.renovacion',
    ]);

  // create new modules

  appReno.config(['$stateProvider', 'accessSupplierProvider', 'objectSystemConfiguration', '$ocLazyLoadProvider', 'mServiceStateProvider', '$urlRouterProvider',
    function($stateProvider, accessSupplier, objectSystemConfiguration, $ocLazyLoadProvider, mServiceState, $urlRouterProvider){

        $ocLazyLoadProvider.config({
            debug:false,
            suppressBootstrapWarning: true,
            loadedModules: ['appReno']
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
          if (toState.name === 'renov' && originSystemFactory.isOriginSystem(constants.ORIGIN_SYSTEMS.selfService.code)) {
        
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

});
