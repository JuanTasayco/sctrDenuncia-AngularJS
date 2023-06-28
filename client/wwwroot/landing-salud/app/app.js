'use strict';

define([
  'angular',
  'landingRoutes',
  'constants',
  'appConstant',
  'angular_messages',
  'angular_ocLazyLoad',
  'angular_route',
  'angular_ui_route',
  'oim_ocLazyLoad',
  'helper',
  'mDirective',
  'mMainServices',
  'oim_commons',
  'oim_theme_service',
  'ui-mask',
  'uiSelect'
], function(
  angular,
  landingRoutes,
  constants,
  appConstant) {

  configFn.$inject = [
    '$ocLazyLoadProvider',
    '$stateProvider',
    '$urlRouterProvider',
    'accessSupplierProvider',
    'mServiceStateProvider',
    'objectSystemConfiguration'
  ];

  function configFn(
    $ocLazyLoadProvider,
    $stateProvider,
    $urlRouterProvider,
    accessSupplier,
    mServiceState,
    objectSystemConfiguration
  ) {
    $ocLazyLoadProvider.config({
      debug: false,
      suppressBootstrapWarning: true,
      loadedModules: [appConstant.appModule]
    });
    objectSystemConfiguration.allowInjectProfile = true;
    objectSystemConfiguration.allowAccessPrivileges = true;
    mServiceState.appends(landingRoutes);
    $urlRouterProvider.otherwise('/');
  }

  return angular
    .module(appConstant.appModule, [
      'ngRoute',
      'ui.router',
      'oc.lazyLoad',
      'mapfre.controls',
      'mapfre.mainServices',
      'ngAnimate',
      'ngSanitize',
      'oim.commons',
      'oim.layout',
      'oim.oc.lazyload',
      'oim.proxyService.Login',
      'oim.security.authorization',
      'oim.wrap.gaia.httpSrv',
      'oim.theme.service',
      'ui.bootstrap',
      'ui.mask',
      'ui.select',
      'oim.proxyService.poliza'
    ])
    .config(configFn);
});
