'use strict';

define(['angular'], function(ng) {
  AgregarVehiculoTerceroController.$inject = ['$rootScope'];
  function AgregarVehiculoTerceroController($rootScope) {
    var vm = this;
    var onFrmvehiculoTerceroCerrado;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.handleAgregarvehiculoTercero = handleAgregarvehiculoTercero;
    vm.handleEditarvehiculoTercero = handleEditarvehiculoTercero;
    vm.handleEliminarvehiculoTercero = handleEliminarvehiculoTercero;
    vm.showFrmAddvehiculoTercero = showFrmAddvehiculoTercero;
    vm.showViewFrmAddvehiculoTercero = true;
    

    function onInit() {
      onFrmvehiculoTerceroCerrado = $rootScope.$on('vehiculoTercero:frmCerrado', frmvehiculoTerceroCerrado);
      vm.vehiculoTercero = vm.vehiculoTercero || [];
      vm.showAddFrm = false;
      showBtnsSegunCantidadvehiculoTercero();
    }

    function onDestroy() {
      onFrmvehiculoTerceroCerrado();
    }

    function areTherevehiculoTercero() {
      return vm.vehiculoTercero.length ? true : false;
    }

    function handleAgregarvehiculoTercero(event) {
      vm.onAgregar({
        $event: {
          vehiculoTercero: event.vehiculoTercero
        }
      });
    }

    function handleEditarvehiculoTercero(event) {
      vm.onEditar({
        $event: {
          idx: event.idx,
          vehiculoTercero: event.VehiculoTercero
        }
      });
    }

    function handleEliminarvehiculoTercero(idx) {
      vm.onEliminar({
        $event: {
          idx: idx
        }
      });
      showBtnsSegunCantidadvehiculoTercero();
    }

    function frmvehiculoTerceroCerrado() {
      showBtnsSegunCantidadvehiculoTercero();
      vm.showViewFrmAddvehiculoTercero = true;
    }

    function showBtnsSegunCantidadvehiculoTercero() {
      vm.showBoxInicialAgregar = !areTherevehiculoTercero();
      vm.showBtnAddvehiculoTercero = areTherevehiculoTercero();
    }

    function showFrmAddvehiculoTercero() {
      vm.showViewFrmAddvehiculoTercero = false;
      vm.showBoxInicialAgregar = false;
      vm.showBtnAddvehiculoTercero = false;
      vm.showAddFrm = true;
    }

    function subirFotoSoat(event) {
      return wpFactory.siniestro.UploadThirdParties(event.photoToUpload, {
        imageTypeCode: 12,
        itemConductor: vm.frm.ocupanteTercero.itemConductor
      });
    }

    function subirFotoTarjeta(event) {
      return wpFactory.siniestro.UploadThirdParties(event.photoToUpload, {
        imageTypeCode: 11,
        itemConductor: vm.frm.ocupanteTercero.itemConductor
      });
    }

    function subirFotoLicencia(event) {
      return wpFactory.siniestro.UploadThirdParties(event.photoToUpload, {
        imageTypeCode: 10,
        itemConductor: vm.frm.ocupanteTercero.itemConductor
      });
    }

    function subirFotosSiniestro(event) {
      return wpFactory.siniestro.UploadThirdParties(event.photoToUpload, {
        imageTypeCode: 13,
        itemConductor: vm.frm.ocupanteTercero.itemConductor
      });
    }

    function _asignarDatosAlModelo() {
      vm.rdxDanhoVehiculoTerceroUpdate(vm.vehiculo.vehiculoTercero && vm.vehiculo.vehiculoTercero.detalleDanioVehiculo);
      vm.rdxOcupantesVehiculoTerceroUpdate(vm.vehiculo.lesionadosTercero);
      vm.frm = _.assign({}, vm.frm, vm.vehiculo);
      _setCorrelativoItem();
      var arrFotosVehiculo = vm.frm.vehiculoTercero.fotosVehiculo;
      if (arrFotosVehiculo.length) {
        vm.frm.tab4At1.fotosVehiculo = wpFactory.help.getArrayBy(arrFotosVehiculo, 'imageTypeCode', 13);
        vm.frm.tab4At1.fotosDoc[0] = wpFactory.help.getArrayBy(arrFotosVehiculo, 'imageTypeCode', 12)[0];
        vm.frm.tab4At1.fotosDoc[1] = wpFactory.help.getArrayBy(arrFotosVehiculo, 'imageTypeCode', 11)[0];
        vm.frm.tab4At1.fotosDoc[2] = wpFactory.help.getArrayBy(arrFotosVehiculo, 'imageTypeCode', 10)[0];
      }
    }

  }

  return ng
    .module('appWp')
    .controller('AgregarVehiculoTerceroController', AgregarVehiculoTerceroController)
    .component('wpAgregarVehiculoTercero', {
      templateUrl: '/webproc/app/components/detalle-asistencia/common/agregar-vehiculo-tercero/agregar-vehiculo-tercero.html',
      controller: 'AgregarVehiculoTerceroController',
      bindings: {
        vehiculoTercero: '=?',
        onAgregar: '&?',
        onEditar: '&?',
        onEliminar: '&?',
        modoLectura: '=?'
      }
    });
});
