'use strict';

define(['angular', 'AsistenciaActions', 'lodash', 'wpAgregarDanho', 'wpAgregarOcupante'], function(
  ng,
  AsistenciaActions,
  _
) {
  AgregarEditarVehiculoController.$inject = [
    '$rootScope',
    '$scope',
    '$timeout',
    '$log',
    '$ngRedux',
    'wpFactory',
    'mModalAlert'
  ];
  function AgregarEditarVehiculoController($rootScope, $scope, $timeout, $log, $ngRedux, wpFactory, mModalAlert) {
    var vm = this;
    var actionsRedux;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.grabarVehiculo = grabarVehiculo;
    vm.cerrarFrm = cerrarFrm;
    vm.agregarDanho = agregarDanho;
    vm.editarDanho = editarDanho;
    vm.eliminarDanho = eliminarDanho;
    vm.agregarOcupante = agregarOcupante;
    vm.editarOcupante = editarOcupante;
    vm.eliminarOcupante = eliminarOcupante;
    vm.servicePhotoModal = servicePhotoModal;
    vm.subirFotosSiniestro = subirFotosSiniestro;
    vm.subirFotoSoat = subirFotoSoat;
    vm.subirFotoTarjeta = subirFotoTarjeta;
    vm.subirFotoLicencia = subirFotoLicencia;

    // declaracion

    function onInit() {
      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
      vm.optImgsTabs = {
        isPhotoValid: {},
        // uso de referencia de objs
        statusBlock: vm.statusBlock
      };
      vm.frm = {
        ocupanteTercero: {},
        tab4At1: {
          fotosDoc: [],
          fotosVehiculo: []
        },
        vehiculoTercero: {
          fotosVehiculo: []
        }
      };
      vm.dateFormat = 'dd/MM/yyyy';
      vm.frmTitulo = vm.esFrmAgregar ? 'Registro de Tercero - Vehículo' : 'Edición de Tercero - Vehículo';
      vm.tabs = [
        {
          titulo: 'Datos del conductor',
          tpl:
            '/webproc/app/components/detalle-asistencia/terceros/agregar-vehiculo/agregar-editar-vehiculo/tabConductor.html'
        },
        {
          titulo: 'Datos del vehículo',
          tpl:
            '/webproc/app/components/detalle-asistencia/terceros/agregar-vehiculo/agregar-editar-vehiculo/tabVehiculo.html'
        },
        {
          titulo: 'Ocupantes lesionados',
          tpl:
            '/webproc/app/components/detalle-asistencia/terceros/agregar-vehiculo/agregar-editar-vehiculo/tabLesionados.html'
        }
      ];
      vm.rdxDanhoVehiculoTerceroUpdate([]);
      vm.rdxOcupantesVehiculoTerceroUpdate([]);
      vm.esFrmAgregar ? _setCorrelativoItem() : _asignarDatosAlModelo();
    }

    function onDestroy() {
      actionsRedux();
    }

    function mapStateToThis(state) {
      return {
        lstDanhos: ng.copy(state.tercerosVehiculo.danhos),
        lstOcupantes: ng.copy(state.tercerosVehiculo.ocupantes),
        statusBlock: state.frmStatus,
        asistencia: _.merge({}, state.detalle)
      };
    }

    function servicePhotoModal(photo) {
      return wpFactory.siniestro.ViewImageByPath(photo.nombreFisico, 0);
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

    // tab vehiculo: comp daños

    function agregarDanho(event) {
      vm.rdxDanhoVehiculoTerceroAdd(event.danho);
    }

    function editarDanho(event) {
      vm.rdxDanhoVehiculoTerceroEdit(event.idx, event.danho);
    }

    function eliminarDanho(event) {
      vm.rdxDanhoVehiculoTerceroDelete(event.idx);
    }

    // tab lesionados: comp lesionados

    function agregarOcupante(event) {
      vm.rdxOcupantesVehiculoTerceroAdd(
        ng.extend({}, event.ocupante, {
          itemOcupante: _getCorrelativoByOcupantes()
        })
      );
    }

    function editarOcupante(event) {
      vm.rdxOcupantesVehiculoTerceroEdit(event.idx, event.ocupante);
    }

    function eliminarOcupante(event) {
      vm.rdxOcupantesVehiculoTerceroDelete(event.idx);
    }

    // modal

    function cerrarFrm() {
      // HACK: para verificar luego que el vehiculo ha sido agregado al state
      $timeout(function temfc() {
        $rootScope.$emit('vehiculo:frmCerrado');
      });
      vm.close();
    }

    function grabarVehiculo() {
      if (vm.frmTabs[0].$invalid || vm.frmTabs[1].$invalid) {
        return void _onInvalidFrm();
      }
      if (!vm.lstDanhos.length) {
        return void _onInvalidLstDanhos();
      }

      _setDataConductorTercero();

      vm.esFrmAgregar ? _actionOnAdd() : _actionOnEdit();
      cerrarFrm();
    }

    function _onInvalidFrm() {
      _.times(2, function(idx) {
        vm.frmTabs[idx].markAsPristine();
      });
      vm.lstDanhos.length || (vm.isInvaid = true);
      vm.isFrmFire = true;
    }

    function _onInvalidLstDanhos() {
      mModalAlert.showError('Faltó ingresar al menos un daño de vehículo tercero', 'Error');
      vm.tabActive = 1;
      vm.isFrmFire = true;
    }

    function _setDataConductorTercero() {
      _setDataVehiculoTercero();
      vm.frm.lesionadosTercero = _.map(vm.lstOcupantes, function mlo(item) {
        return ng.extend({}, item, {
          itemTerceroOcupante: _getCorrelativoByTercero()
        });
      });
    }

    function _setCorrelativoItemConductor() {
      vm.frm.ocupanteTercero.itemConductor = _getCorrelativoByTercero();
    }

    function _setCorrelativoItemTerceroVehiculo() {
      vm.frm.vehiculoTercero.itemTerceroVehiculo = _getCorrelativoByTercero();
    }

    function _getCorrelativoByTercero() {
      return (
        vm.frm.ocupanteTercero.itemConductor || wpFactory.getCorrelativoItemConductor(vm.asistencia.conductorTercero)
      );
    }

    function _getCorrelativoByOcupantes() {
      return wpFactory.getCorrelativoItemOcupante(vm.lstOcupantes);
    }

    function _setCorrelativoItem() {
      _setCorrelativoItemConductor();
      _setCorrelativoItemTerceroVehiculo();
    }

    function _setDataVehiculoTercero() {
      if (vm.frm.vehiculoTercero) {
        vm.frm.vehiculoTercero.detalleDanioVehiculo = vm.lstDanhos;
        // HACK: para que mongo no lance error
        vm.frm.vehiculoTercero.fotosVehiculo || (vm.frm.vehiculoTercero.fotosVehiculo = []);
      }

      vm.frm.vehiculoTercero.fotosVehiculo = [].concat(
        wpFactory.help.getArrayWithOutNullables(vm.frm.tab4At1.fotosVehiculo),
        wpFactory.help.getArrayWithOutNullables(vm.frm.tab4At1.fotosDoc)
      );
    }

    function _actionOnAdd() {
      vm.onAgregar({
        $event: {
          vehiculo: vm.frm
        }
      });
    }

    function _actionOnEdit() {
      vm.onEditar({
        $event: {
          idx: vm.idxVehiculo,
          vehiculo: vm.frm
        }
      });
      $scope.$emit('vehiculo:frmEditCerrado');
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('AgregarEditarVehiculoController', AgregarEditarVehiculoController)
    .component('wpAgregarEditarVehiculo', {
      templateUrl:
        '/webproc/app/components/detalle-asistencia/terceros/agregar-vehiculo/agregar-editar-vehiculo/agregar-editar-vehiculo.html',
      controller: 'AgregarEditarVehiculoController',
      bindings: {
        close: '&?',
        esFrmAgregar: '<?',
        idxVehiculo: '<?',
        onAgregar: '&?',
        onEditar: '&?',
        vehiculo: '<?'
      }
    });
});
