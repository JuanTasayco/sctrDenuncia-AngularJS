'use strict';

define(
  [
    'angular',
    'inspec_routes',
    'lodash',
    'angular_route',
    'angular_ocLazyLoad',
    'angular_ui_route',
    'oim_ocLazyLoad',
    'oim_theme_service',
    'oim_commons',
    'mDirective',
    'uiSelect',
    'helper',
    'angular_messages',
    'ui-mask',
    'fileSaver',
    'servicePoliza',
    'mxPaginador',
    'images-resizer',
    'mMainServices',
    'oimGoogleAnalytics',
  ],
  function(ng, appRoutes, _) {

    helper.setTitleByOrigin(window.localStorage['appOrigin'], 'Inspecciones Autos');

    configFn.$inject = [
      'accessSupplierProvider',
      'objectSystemConfiguration',
      '$ocLazyLoadProvider',
      'mServiceStateProvider',
      '$urlRouterProvider'
    ];
    function configFn(
      accessSupplier,
      objectSystemConfiguration,
      $ocLazyLoadProvider,
      mServiceState,
      $urlRouterProvider
    ) {
      $ocLazyLoadProvider.config({
        debug: false,
        suppressBootstrapWarning: true,
        loadedModules: ['appInspec']
      });
      objectSystemConfiguration.allowInjectProfile = true;
      objectSystemConfiguration.allowAccessPrivileges = true;
      mServiceState.appends(appRoutes, function(state) {
        accessSupplier.$get().applyResolve(state);
      });
      $urlRouterProvider.otherwise('/solicitudes');
    }

    runFn.$inject = [
      '$rootScope',
      'oimProgress',
      '$location',
      'accessSupplier',
      'UserService',
      '$anchorScroll',
      '$timeout',
      'oimAbstractFactory',
      'oimPrincipal',
      'inspecFactory',
      '$state'
    ];
    function runFn(
      $rootScope,
      oimProgress,
      $location,
      accessSupplier,
      UserService,
      $anchorScroll,
      $timeout,
      oimAbstractFactory,
      oimPrincipal,
      inspecFactory,
      $state
    ) {

      // Estilos myDream
       oimAbstractFactory.applyStylesMyDream();

      var stateChangeStart = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {

        oimProgress.start();
        accessSupplier.getAllObject().then(function(response) {
          response = response || [];
          oimPrincipal.init()
          UserService.agentInfo = oimPrincipal.getAgent();
          UserService.username = oimPrincipal.getUsername().toUpperCase();
          UserService.role = oimPrincipal.get_role();
          UserService.setInspecRole();
          UserService.setAuthorizedResource(response);
        });
      });

      var stateChangeSuccess = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams, options) {

        if (!inspecFactory.isAuthorized(toState, toParams)){
          $timeout(function () {
            $state.go('accessdenied');
          });
        }

        if ($rootScope.cancelSpin !== true) {
          oimProgress.end();
        }
        $anchorScroll();
      });

      var locationChangeSuccess = $rootScope.$on('$locationChangeSuccess', function() {
        $rootScope.actualLocation = $location.path();
      });

      $rootScope.$on('$destroy', function() {
        stateChangeStart();
        stateChangeSuccess();
        locationChangeSuccess();
      });


    }

    return ng
      .module('appInspec', [
        'ngRoute',
        'oc.lazyLoad',
        'ui.router',
        'ngAnimate',
        'ngSanitize',
        'ui.bootstrap',
        'oim.oc.lazyload',
        'oim.theme.service',
        'oim.layout',
        'mapfre.controls',
        'ui.bootstrap.modal',
        'ui.select',
        'oim.proxyService.Login',
        'ui.mask',
        'oim.security.authorization',
        'oim.proxyService.poliza',
        'AuthInspec',
        'appInspec.factory',
        'oim.commons',
        'images-resizer',
        'mapfre.mainServices',
        'oim.google.analytics',
      ])
      .config(configFn)
      .run(runFn);
  }
);
