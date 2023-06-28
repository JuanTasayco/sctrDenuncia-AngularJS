'use strict';

define(['angular', 'AsistenciaActions'], function(ng, AsistenciaActions) {
  TercerosController.$inject = ['$interval', '$ngRedux', 'wpFactory'];
  function TercerosController($interval, $ngRedux, wpFactory) {
    var vm = this;
    var actionsRedux;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.agregarPeaton = agregarPeaton;
    vm.editarPeaton = editarPeaton;
    vm.eliminarPeaton = eliminarPeaton;
    vm.agregarBien = agregarBien;
    vm.editarBien = editarBien;
    vm.eliminarBien = eliminarBien;
    vm.agregarVehiculoTercero = agregarVehiculoTercero;
    vm.editarVehiculoTercero = editarVehiculoTercero;
    vm.eliminarVehiculoTercero = eliminarVehiculoTercero;

    // declaracion

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        lstBienes: ng.copy(state.detalle.bienesTercero),
        lstPeatones: ng.copy(state.detalle.peatonesTercero),
        lstVehiculos: ng.copy(state.detalle.conductorTercero)
      };
    }

    // seccion peaton
    function agregarPeaton(event) {
      vm.rdxFrmSaved(false);
      vm.rdxPeatonAdd(event.peaton);
    }

    function editarPeaton(event) {
      vm.rdxFrmSaved(false);
      vm.rdxPeatonEdit(event.idx, event.peaton);
    }

    function eliminarPeaton(event) {
      vm.rdxFrmSaved(false);
      vm.rdxPeatonDelete(event.idx);
    }

    // seccion bien
    function agregarBien(event) {
      vm.rdxFrmSaved(false);
      vm.rdxBienAdd(event.bien);
    }

    function editarBien(event) {
      vm.rdxFrmSaved(false);
      vm.rdxBienEdit(event.idx, event.bien);
    }

    function eliminarBien(event) {
      vm.rdxFrmSaved(false);
      vm.rdxBienDelete(event.idx);
    }

    // seccion vehiculos
    function agregarVehiculoTercero(event) {
      vm.rdxFrmSaved(false);
      vm.rdxVehiculoTerceroAdd(event.vehiculo);
    }

    function editarVehiculoTercero(event) {
      vm.rdxFrmSaved(false);
      vm.rdxVehiculoTerceroEdit(event.idx, event.vehiculo);
    }

    function eliminarVehiculoTercero(event) {
      wpFactory.siniestro.DeleteThirdPartyBy(event.itemConductor);
      vm.rdxFrmSaved(false);
      vm.rdxVehiculoTerceroDelete(event.idx);
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('TercerosController', TercerosController)
    .component('wpTerceros', {
      templateUrl: '/webproc/app/components/detalle-asistencia/terceros/terceros.html',
      controller: 'TercerosController',
      bindings: {}
    });
});
