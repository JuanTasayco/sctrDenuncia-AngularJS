'use strict';

define(['angular'], function(ng) {
  AutoAcorController.$inject = [];
  function AutoAcorController() {
    var vm = this;
    vm.$onInit = onInit;

    //

    function onInit() {
      vm.isPlacaAvailable = !!vm.info.placaVehiculo;
      vm.isVehicleTypeAvailable = !!vm.info.tipoVehiculoAsegurado;
    }
  }

  return ng
    .module('appWp')
    .controller('AutoAcorController', AutoAcorController)
    .component('wpAutoAcor', {
      templateUrl: '/webproc/app/components/detalle-asistencia/vehiculo/auto-acor/auto-acor.html',
      controller: 'AutoAcorController',
      bindings: {
        info: '=?'
      }
    });
});
