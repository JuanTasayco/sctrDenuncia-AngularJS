'use strict';

define(['angular'], function(ng) {
  vehicleDataController.$inject = ['inspecFactory'];

  function vehicleDataController(inspecFactory) {
    var vm = this;

    vm.$onInit = onInit;

    function onInit() {
      vm.data = vm.data || {};
      inspecFactory.vehicle.getTipoVehiculo().then(function(response){
        if (response.OperationCode == constants.operationCode.success){
          vm.tipoVehiculo = response.Data;
        }
      });
    }

    function searchMarcaModelo(input) {
      if (input && input.length >= 3) {
         var paramMarcaModelo = {
            CodigoTipo: $scope.formData.mTipoVehiculo.CodigoTipo,
            Texto : wilcar.toUpperCase()
          }
        return inspecFactory.vehicle.getListMarcaModelo(params);
      }
    }
  }

  return ng
    .module('appInspec')
    .controller('VehicleDataController', vehicleDataController)
    .component('inspecVehicleData', {
      templateUrl: '/inspec/app/common/vehicle-data/vehicle-data.html',
      controller: 'VehicleDataController',
      controllerAs: '$ctrl',
      bindings: {
        data: '=',
        anchor: '='
      }
    });
});
