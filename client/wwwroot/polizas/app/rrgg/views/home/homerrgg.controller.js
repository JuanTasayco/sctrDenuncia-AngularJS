define([
  'angular', 'constants', 'constantsRiesgosGenerales'
], function (angular, constants, constantsRiesgosGenerales) {
  'use strict';

  angular
    .module("appRrgg")
    .controller('homeRrggController', HomeRrggController);

  HomeRrggController.$inject = ['$state', '$scope', 'isAdmin','riesgosGeneralesFactory','oimPrincipal'];

  function HomeRrggController($state, $scope, isAdmin,riesgosGeneralesFactory,oimPrincipal) {
    (function load_HomeRrggController() {
      var vRole = oimPrincipal.get_role();
      $scope.clonePermission = isAdmin || _.contains(["ADMIN-RRGG"], vRole);
    })();
    
    $scope.IrACotizar = function () {
      riesgosGeneralesFactory.initCotizacion();
      $state.go(constantsRiesgosGenerales.ROUTES.COTIZACION_STEPS, { step: 1 }, { reload: true, inherit: false });
    }
    $scope.GetHrefBandejaPoliza = function () {
      $state.go(constantsRiesgosGenerales.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
    }
    $scope.IrAClonar = function () {
      $state.go(constantsRiesgosGenerales.ROUTES.CLONAR, {}, { reload: true, inherit: false });
    }
  }

});

