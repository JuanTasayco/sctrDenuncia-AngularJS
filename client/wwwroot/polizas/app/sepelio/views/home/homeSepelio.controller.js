define([
  'angular', 'constants', 'constantsSepelios', 'campoSantoFactory'
], function (angular, constants, constantsSepelios) {
  'use strict';

  angular
    .module("appSepelio")
    .controller('homeSepeliosController', homeSepeliosController);

  homeSepeliosController.$inject = ['$state', '$scope', 'oimClaims', 'campoSantoFactory','sepelioAuthorize','proxyMenu'];

  function homeSepeliosController($state, $scope, oimClaims, campoSantoFactory,sepelioAuthorize,proxyMenu) {

    $scope.userType;
    $scope.codeModule = $state.current.nombreCorto || $state.toOimState.nombreCorto || null;

    (function load_homeSepeliosController() {
      proxyMenu.GetSubMenu('EMISA-CAMPOSANTO', true)
      .then(function (response) {
        sepelioAuthorize.setHomeMenu(response.data);
        if(!sepelioAuthorize.isAuthorized('HOME')){
          $state.go('accessdenied');
        }
      })
      .catch(function (error) {
          $state.go('accessdenied');
      });

      campoSantoFactory.setClaims(oimClaims);
      $scope.userType = oimClaims.userSubType;

      
    })();

    $scope.IrACotizar = function () {
      campoSantoFactory.setidCotizacion(null);
      campoSantoFactory.setdataProspecto(null);
      $state.go(constantsSepelios.ROUTES.COTIZACION_STEPS, { step: 1 }, { reload: true, inherit: false });
    }

    $scope.IrBandejaPoliza = function () {
      $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION, {}, { reload: true, inherit: false });
    }
    $scope.irBandejaDocumento = function () {
      $state.go(constantsSepelios.ROUTES.BANDEJA_DOCUMENTOS, {}, { reload: true, inherit: false });
    }
    $scope.irCorreoExcepcional = function () {
      $state.go(constantsSepelios.ROUTES.CORREO_EXCEPCIONAL, {}, { reload: true, inherit: false });
    }
    $scope.irGestionDocumentos = function () {
      $state.go(constantsSepelios.ROUTES.GESTION_DOCUMENTOS, {}, { reload: true, inherit: false });
    }
    $scope.irAgrupamiento = function () {
      $state.go(constantsSepelios.ROUTES.AGRUPAMIENTO, {}, { reload: true, inherit: false });
    }

    $scope.validate = function(itemName){
      return sepelioAuthorize.menuItem($scope.codeModule, itemName);
    }

  }

});

