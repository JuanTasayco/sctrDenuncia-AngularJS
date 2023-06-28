define([
  'angular', '/polizas/app/autos/autosEmitirNuevo/component/component.js', '/polizas/app/autos/autosHome/service/autosFactory.js'
], function (angular, factory) {

  angular.module("appAutos").controller("carEmitPolizeData", ['$scope', '$stateParams', 'autosFactory', '$q', '$rootScope', '$location', '$window', '$state', function ($scope, $stateParams, autosFactory, $q, $rootScope, $location, $window, $state) {

    }])

    .filter('isEmpty', function () {
      var bar;
      return function (obj) {
        for (bar in obj) {
          if (obj.hasOwnProperty(bar)) {
            return false;
          }
        }
        return true;
      };
    })

    .filter('makePositive', function () {
      return function (num) {
        return Math.abs(num);
      }
    })

    .component('mpfBlkPolizaGrupoAutomovil',
      {
        templateUrl: '/polizas/app/autos/autosCotizar/component/blocks/mpf-blk-poliza-grupo.html',
        controller: 'emitirController',
        bindings: {
          info: '=',
          function: '&'
        }
      })


});
    


