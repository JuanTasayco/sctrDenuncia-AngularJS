'use strict';

define([
  'angular',
  'appRoutes',
  'logger',
  'ngRaven',
  'constants',
  'coreConstants',
  'angular_messages',
  'angular_ocLazyLoad',
  'angular_route',
  'angular_ui_route',
  'AdminRamoFactory',
  'GeneralAdminRamoFactory',
  'GeneralAdminMapfreTecuidamosFactory',
  'GeneralAdditionalServiceFactory',
  'MassesAndResponsesFactory',
  'CarouselTrayFactory',
  'BannerRecordsFactory',
  'CarouselModificationFactory',
  'AddBannerFactory',
  'MassMaintenanceFactory',
  'MassTrayFactory',
  'CommonFactory',
  'CemeteryFactory',
  'GeneralAdminClinicaDigitalFactory',
  'checklist-model',
  'helper',
  'mDirective',
  'mMainServices',
  'mxPaginador',
  'oim_commons',
  'oim_ocLazyLoad',
  'oim_theme_service',
  'SecurityFactory',
  'ui-mask',
  'uiSelect',
  'quill',
  'ngQuill',
], function(ng, appRoutes, logger, ngRaven, constants, coreConstants) {
  ngRaven.config('https://52064c4939054ae4a6667484ecc0f817@o161404.ingest.sentry.io/5285754').install();
  ngRaven.setEnvironment(constants.environment);

  configFn.$inject = [
    '$ocLazyLoadProvider',
    '$stateProvider',
    '$urlRouterProvider',
    'accessSupplierProvider',
    'mServiceStateProvider',
    'objectSystemConfiguration'
  ];

  function configFn($ocLazyLoadProvider, $stateProvider, $urlRouterProvider, accessSupplier, mServiceState, objectSystemConfiguration) {

    $ocLazyLoadProvider.config({
      debug: false,
      suppressBootstrapWarning: true,
      loadedModules: [coreConstants.ngMainModule]
    });
    objectSystemConfiguration.allowInjectProfile = true;
    objectSystemConfiguration.allowAccessPrivileges = true;
    mServiceState.appends(appRoutes, function(state) {
      accessSupplier.$get().applyResolve(state);
    });
    $urlRouterProvider.otherwise('/');
  }

  runFn.$inject = ['$rootScope', 'oimProgress', '$route', '$location'];

  function runFn($rootScope, oimProgress, $route, $location) {
    var stChStartFn = $rootScope.$on('$stateChangeStart', function() {
      oimProgress.start();
    });

    var stChSuccessFn = $rootScope.$on('$stateChangeSuccess', function() {
      $rootScope.cancelSpin || oimProgress.end();
    });

    var locChSuccessFn = $rootScope.$on('$locationChangeSuccess', function() {
      $rootScope.actualLocation = $location.path();
    });

    $rootScope.$on('$destroy', function destroy() {
      stChStartFn();
      stChSuccessFn();
      locChSuccessFn();
    });
  }

  return ng
    .module(coreConstants.ngMainModule, [
      coreConstants.ngAdminRamoModule,
      coreConstants.ngGeneralAdminRamoModule,
      coreConstants.ngGeneralAdditionalServiceModule,
      coreConstants.ngGeneralAdminMapfreTecuidamosModule,
      coreConstants.ngMassesAndResponsesModule,
      coreConstants.ngCarouselTrayModule,
      coreConstants.ngBannerRecordsModule,
      coreConstants.ngCarouselModificationModule,
      coreConstants.ngSecurityModule,
      coreConstants.ngAddBannerModule,
      coreConstants.ngMassMaintenanceModule,
      coreConstants.ngMassTrayModule,
      coreConstants.ngCommonModule,
      coreConstants.ngCemeteryModule,
      coreConstants.ngGeneralAdminClinicaDigitalModule,
      'checklist-model',
      'mapfre.controls',
      'mapfre.mainServices',
      'ngAnimate',
      'ngRedux',
      'ngRoute',
      'ngSanitize',
      'oc.lazyLoad',
      'oim.commons',
      'oim.layout',
      'oim.oc.lazyload',
      'oim.proxyService.Login',
      'oim.security.authorization',
      'oim.theme.service',
      'ui.bootstrap.modal',
      'ui.bootstrap.pagination',
      'ui.bootstrap.tabs',
      'ui.bootstrap',
      'ui.mask',
      'ui.router',
      'ui.select',
      'ngRaven',
      'ngQuill'
    ])
    .config(configFn)
    .run(runFn);
});
