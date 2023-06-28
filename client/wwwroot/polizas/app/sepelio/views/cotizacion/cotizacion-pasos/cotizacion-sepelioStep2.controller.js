define([
  'angular', 'constants', 'constantsSepelios', 'cpsCotizacionAlternativas', 'cpsSimuladorCotizacion', 'mpfPersonComponent', 'cpsDetalleCotizacionFinan',
  'cpsDetalleCotizacion'
], function (angular, constants, constantsSepelios) {
  'use strict';

  angular
    .module("appSepelio")
    .controller('cotizacionSepelioStep2Controller', cotizacionSepelioStep2Controller);

  cotizacionSepelioStep2Controller.$inject = ['$scope', '$state', 'mainServices', 'mModalAlert', 'mpSpin', '$uibModal', 'mModalConfirm', 'oimClaims', 'campoSantoFactory', 'campoSantoService'];

  function cotizacionSepelioStep2Controller($scope, $state, mainServices, mModalAlert, mpSpin, $uibModal, mModalConfirm, oimClaims, campoSantoFactory, campoSantoService) {
    $scope.cotizacion = {};
    $scope.dataStep = {};
    (function load_cotizacionSepelioStep2Controller() {
      $scope.constantsCps = constantsSepelios;
      campoSantoFactory.setCotizacionProducto($scope.cotizacion);
      $scope.cotizacion = campoSantoFactory.cotizacion;
      $scope.cotizacion.datosCotizacion = campoSantoFactory.getdataDetalleSimulacion();
      $scope.cotizacion.step.view = campoSantoFactory.getComponenteView();

      $scope.dataStep = {
        fromStep2:  true,
        directo: $scope.cotizacion.datosCotizacion.directo
      }
      campoSantoFactory.setDataStep($scope.dataStep);
      
    })();

    $scope.bandejaCotizacion = function () {
      $state.go(constantsSepelios.ROUTES.BANDEJA_COTIZACION);
    }
  }

});
