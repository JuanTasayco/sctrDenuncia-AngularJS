'use strict';

define(['angular', 'lodash'], function(ng, _) {
  TallerController.$inject = [];
  function TallerController() {
    var vm = this;
    vm.$onInit = onInit;

    // declaracion

    function onInit() {
      var isFromSeleccion = _.keys(vm.seleccionado).length ? true : false;
      var montoManual = '15% adicional al monto indemnizable + $100';

      if (isFromSeleccion) {
        if (vm.seleccionado.type === 'manual') {
          vm.txtMontoIndenmizable = montoManual;
          vm.nombreTaller = 'TALLER NUEVO';
          vm.montoSuperior = 'US$ 150';
          vm.tipoTaller = 'Ingreso manual';
        }
      } else {
        vm.txtMontoIndenmizable = vm.datos.deducible;
        vm.nombreTaller = vm.datos.nombreTaller;
        vm.montoSuperior = vm.datos.importeMinimo;
        vm.tipoTaller = vm.datos.nombreTipoTaller;
      }
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('TallerController', TallerController)
    .component('wpTaller', {
      templateUrl: '/webproc/app/components/detalle-asistencia/talleres/taller/taller.html',
      controller: 'TallerController',
      bindings: {
        datos: '<?',
        idSeleccion: '<?',
        onDeseleccionar: '&?',
        onSeleccionar: '&?',
        seleccionado: '<?'
      }
    });
});
