'use strict';

define(['angular', 'AsistenciaActions', 'lodash', 'wpConstant'], function (ng, AsistenciaActions, _, wpConstant) {
  DetalleSiniestroController.$inject = ['$interval', '$ngRedux', 'wpFactory', '$scope'];
  function DetalleSiniestroController($interval, $ngRedux, wpFactory, $scope) {
    var vm = this;
    var actionsRedux, updateIntervalPromise, oldFrm, watchFrmRequire;
    vm.$onDestroy = onDestroy;
    vm.$onInit = onInit;
    vm.subirFotosCroquis = subirFotosCroquis;
    vm.eliminarFotoCroquis = eliminarFotoCroquis;
    vm.subirFotosOtros = subirFotosOtros;
    vm.eliminarFotoOtros = eliminarFotoOtros;
    vm.servicePhotoModal = servicePhotoModal;

    vm.changePlaca = changePlaca;
    vm.changeCompaniaSeguro = changeCompaniaSeguro;
    vm.changeAcuerdoEntreConductores = changeAcuerdoEntreConductores;
    vm.changeResponsabilidad = changeResponsabilidad;

    // declaracion

    function onInit() {

      vm.listaAcuerdoEntreConductores = [];
      vm.disabledAcuerdoEntreConductores = true;

      vm.listaPlaca = [];
      vm.disabledPlaca = true;

      vm.listaCompaniaSeguro = [];
      vm.disabledCompaniaSeguro = true;

      vm.listaResponsabilidad = [];

      vm.showMsgIncomplete = false;
      vm.msgIncomplete = "Para asignar responsabilidad del convenio deberá antes registrar o completar la información de terceros.";

      vm.defaultValueSelect = {
        codigoValor: 0,
        nombreValor: '-',
        codigoCampo: '',
        codigoInstalacion: '',
        codigoRamo: '',
        numeroOrden: 0
      }

      vm.defaultValueSelectPlaca = {
        codigoValor: -1,
        nombreValor: '-',
      }

      actionsRedux = $ngRedux.connect(mapStateToThis, AsistenciaActions)(vm);
      vm.frm.tab5 = {
        acuerdoCompaniaSeguro: '',
        responsabilidad: '',
        acuerdoEntreConductores: '',
        numeroPlaca: '',
        acuerdoPlaca: ''
      };
      vm.fotosCroquis = wpFactory.help.getArrayBy(vm.frm.fotosDetaSiniestro, 'imageTypeCode', 20);
      vm.fotosOtros = wpFactory.help.getArrayBy(vm.frm.fotosDetaSiniestro, 'imageTypeCode', 21);
      oldFrm = ng.copy(vm.frm);
      _autoUpdate();
      watcherFrmRequire();
      _loadAllFotos(vm.fotosCroquis, vm.fotosOtros);

      if (!vm.frm.siniestroConvenio) {
        vm.frm.siniestroConvenio = {
          aplicaConvenio: true,
          codigoConvenioGolpe: 0,
          codigoEmpresaAseguradora: 0,
          numeroPlaca: ''
        }
      }

      fillResponsabilidad();
      fillAcuerdoEntreConductores();

    }

    function onDestroy() {
      $interval.cancel(updateIntervalPromise);
      actionsRedux();
      watchFrmRequire();
    }

    function fillResponsabilidad() {
      vm.listaResponsabilidad = [];
      vm.listaResponsabilidad = [].concat(wpFactory.myLookup.getCodResponsabilidad(), {
        codigoValor: '4',
        nombreValor: 'DETERMINAR POR PNP'
      });

      for (var idx = 0; idx < vm.listaResponsabilidad.length; idx++) {
        if (Number(vm.listaResponsabilidad[idx].codigoValor) === Number(vm.frm.codigoResponsaDetaSiniestro)) {
          vm.frm.tab5.responsabilidad = vm.listaResponsabilidad[idx];
        }
      }
    }

    function changeAcuerdoEntreConductores() {
      fillCompaniaSeguro();
      var auxData = vm.frm.tab5.acuerdoEntreConductores;
      if (Number(auxData.codigoValor) === 71) {
        vm.disabledCompaniaSeguro = false;
      } else {
        setEmptyCompaniaSeguro();
        setEmptyPlaca();
        vm.disabledCompaniaSeguro = true;
        vm.disabledPlaca = true;
      }
      vm.frm.siniestroConvenio.codigoConvenioGolpe = Number(auxData.codigoValor);
      checkMensajeIncomplete();
      checkAplicaConvenio();
    }

    function setEmptyCompaniaSeguro() {
      for (var idx = 0; idx < vm.listaCompaniaSeguro.length; idx++) {
        if (Number(vm.listaCompaniaSeguro[idx].codigoValor) === 0) {
          vm.frm.tab5.acuerdoCompaniaSeguro = vm.listaCompaniaSeguro[idx];
        }
      }

      vm.frm.siniestroConvenio.codigoEmpresaAseguradora = Number(vm.frm.tab5.acuerdoCompaniaSeguro.codigoValor);
      vm.frm.siniestroConvenio.aplicaConvenio = false;
    }

    function changeCompaniaSeguro() {
      vm.frm.siniestroConvenio.codigoEmpresaAseguradora = Number(vm.frm.tab5.acuerdoCompaniaSeguro.codigoValor);

      if (vm.frm.siniestroConvenio.codigoEmpresaAseguradora === 0) {
        setEmptyPlaca();
        vm.disabledPlaca = true;
      } else {
        fillPlaca();
        vm.disabledPlaca = false;
      }

      checkAplicaConvenio();
    }

    function setEmptyPlaca() {
      for (var idx = 0; idx < vm.listaPlaca.length; idx++) {
        if (vm.listaPlaca[idx].codigoValor === -1) {
          vm.frm.tab5.acuerdoPlaca = vm.listaPlaca[idx];
        }
      }

      vm.frm.siniestroConvenio.numeroPlaca = '';
      vm.frm.siniestroConvenio.aplicaConvenio = false;
    }

    function changePlaca() {
      if (vm.frm.tab5.acuerdoPlaca) {
        if (vm.frm.tab5.acuerdoPlaca.nombreValor === '-') {
          vm.frm.siniestroConvenio.numeroPlaca = '';
        } else {
          vm.frm.siniestroConvenio.numeroPlaca = vm.frm.tab5.acuerdoPlaca.nombreValor;
        }
      } else {
        vm.frm.siniestroConvenio.numeroPlaca = '';
      }

      checkAplicaConvenio();
    }

    function setEmptyAcuerdoEntreConductores() {
      for (var idx = 0; idx < vm.listaAcuerdoEntreConductores.length; idx++) {
        if (Number(vm.listaAcuerdoEntreConductores[idx].codigoValor) === 0) {
          vm.frm.tab5.acuerdoEntreConductores = vm.listaAcuerdoEntreConductores[idx];
        }
      }

      vm.frm.siniestroConvenio.codigoConvenioGolpe = Number(vm.frm.tab5.acuerdoEntreConductores.codigoValor);
      vm.frm.siniestroConvenio.aplicaConvenio = false;
    }

    function fillAcuerdoEntreConductores() {
      vm.listaAcuerdoEntreConductores = [];
      
      wpFactory.siniestro.GetAcuerdoConductores().then(function gvSP(resp) {

        vm.listaAcuerdoEntreConductores = filterListaAcuerdoEntreConductores(resp);
        for (var idx = 0; idx < vm.listaAcuerdoEntreConductores.length; idx++) {
          if (vm.listaAcuerdoEntreConductores[idx].codigoValor === vm.frm.siniestroConvenio.codigoConvenioGolpe) {
            vm.frm.tab5.acuerdoEntreConductores = vm.listaAcuerdoEntreConductores[idx];
          }
        }

        fillCompaniaSeguro();
        fillPlaca();
        changeResponsabilidad();
        
      }).catch(function gvEP(err) {
        vm.listaAcuerdoEntreConductores = [];
        $log.error('Falló el obtener acuerdo entre conductores', err);
      });
    
    }

    function filterListaAcuerdoEntreConductores(lista) {
      var aux_list = [
        {
          codigoValor: 0,
          nombreValor: '-'
        }
      ];

      for (var idx = 0; idx < lista.length; idx++) {
        if (vm.frm.siniestroConvenio.codigoConvenioGolpe === 72) {
          aux_list.push({
            codigoValor: lista[idx].codigoParametro,
            nombreValor: lista[idx].valor1
          });
        }
        if (lista[idx].codigoParametro === 70 || lista[idx].codigoParametro === 71) {
          aux_list.push({
            codigoValor: lista[idx].codigoParametro,
            nombreValor: lista[idx].valor1
          });
        }
      }

      return removeDuplicateAcuerdo(aux_list);
    }

    function removeDuplicateAcuerdo(list) {
      var aux_list = [];
      for (var idx = 0; idx < list.length; idx++) {
        var value_exist = false;
        for (var idy = 0; idy < aux_list.length; idy++) {
          if (list[idx].codigoValor === aux_list[idy].codigoValor) {
            value_exist = true;
          }
        }
        if (value_exist === false) {
          aux_list.push(list[idx]);
        }
      }
      return aux_list;
    }

    function fillCompaniaSeguro() {
      vm.listaCompaniaSeguro = [];

      var allSelectedCompanies = wpFactory.myLookup.getTipoSoat();
      var auxSelectedCompanies = [];
      
      vm.listaCompaniaSeguro.push(vm.defaultValueSelect);

      for (var idx = 0; idx < allSelectedCompanies.length; idx++) {
        for (var idy = 0; idy < vm.frm.conductorTercero.length; idy++) {
          if (
            Number(allSelectedCompanies[idx].codigoValor) ===
            Number(vm.frm.conductorTercero[idy].ocupanteTercero.codigoEmpresaAseguradora)
          ) {
            auxSelectedCompanies.push(allSelectedCompanies[idx]);
          }
        }
      }

      // Remove repeated elements
      var auxSelectedCompaniesClean = removeDuplicateCompania(auxSelectedCompanies);

      for (var idz = 0; idz < auxSelectedCompaniesClean.length; idz++) {
        vm.listaCompaniaSeguro.push(auxSelectedCompaniesClean[idz]);
      }

      if (vm.frm.tab5) {
        for (var idn = 0; idn < vm.listaCompaniaSeguro.length; idn++) {
          if (Number(vm.listaCompaniaSeguro[idn].codigoValor) === vm.frm.siniestroConvenio.codigoEmpresaAseguradora) {
            vm.frm.tab5.acuerdoCompaniaSeguro = vm.listaCompaniaSeguro[idn];
          }
        }
      }
    }

    function removeDuplicateCompania(list) {
      var aux_list = [];
      for (var idx = 0; idx < list.length; idx++) {
        var value_exist = false;
        for (var idy = 0; idy < aux_list.length; idy++) {
          if (list[idx].codigoValor === aux_list[idy].codigoValor) {
            value_exist = true;
          }
        }
        if (value_exist === false) {
          aux_list.push(list[idx]);
        }
      }
      return aux_list;
    }

    function fillPlaca() {
      vm.listaPlaca = [];
      var auxSelectedPlaca = [];
      vm.listaPlaca.push(vm.defaultValueSelectPlaca);

      for (var idx = 0; idx < vm.frm.conductorTercero.length; idx++) {
        if (
          vm.frm.tab5 &&
          Number(vm.frm.conductorTercero[idx].ocupanteTercero.codigoEmpresaAseguradora) ===
          Number(vm.frm.tab5.acuerdoCompaniaSeguro.codigoValor)
        ) {
          var aux_data = {
            codigoValor: idx,
            nombreValor: vm.frm.conductorTercero[idx].vehiculoTercero.placaVehiculo
          };
          auxSelectedPlaca.push(aux_data);
        }
      }

      // Remove repeated elements
      var auxSelectedPlacaClean = removeDuplicatePlaca(auxSelectedPlaca);

      for (var idy = 0; idy < auxSelectedPlacaClean.length; idy++) {
        vm.listaPlaca.push(auxSelectedPlacaClean[idy]);
      }

      if (vm.frm.siniestroConvenio.numeroPlaca === '-') {
        vm.frm.siniestroConvenio.numeroPlaca = '';
      }

      if (vm.frm.tab5) {
        var aux_placa = vm.frm.siniestroConvenio.numeroPlaca;
        for (var idn = 0; idn < vm.listaPlaca.length; idn++) {
          if (aux_placa === '') {
            aux_placa = '-';
          }
          if (vm.listaPlaca[idn].nombreValor === aux_placa) {
            vm.frm.tab5.acuerdoPlaca = vm.listaPlaca[idn];
          }
        }
      }
    }

    function removeDuplicatePlaca(list) {
      var aux_list = [];
      for (var idx = 0; idx < list.length; idx++) {
        var value_exist = false;
        for (var idy = 0; idy < aux_list.length; idy++) {
          if (list[idx].nombreValor === aux_list[idy].nombreValor) {
            value_exist = true;
          }
        }
        if (value_exist === false) {
          aux_list.push(list[idx]);
        }
      }
      return aux_list;
    }

    function checkMensajeIncomplete() {
      if (vm.listaCompaniaSeguro.length === 1 && vm.frm.siniestroConvenio.codigoConvenioGolpe === 71) {
        vm.showMsgIncomplete = true;
      }
      if (vm.frm.conductorTercero.length === 0 && vm.frm.siniestroConvenio.codigoConvenioGolpe === 71) {
        vm.showMsgIncomplete = true;
      }
    }

    function changeResponsabilidad() {
      if (vm.frm.tab5.responsabilidad) {
        vm.frm.codigoResponsaDetaSiniestro = vm.frm.tab5.responsabilidad.codigoValor;
      }
      
      if (
        vm.frm &&
        vm.frm.codigoTipoSiniestro === '2' && // Tipo de Siniestro = CHOQUE
        vm.frm.detalleTipoSiniestro.length === 14 && // Exista un Detalle de Siniestro
        vm.frm.detalleTipoSiniestro[13].value === true && // Detalle del siniestro = Entre Vehiculos
        (vm.frm.codigoResponsaDetaSiniestro === '1' || // Responsabilidad = Tercera
          vm.frm.codigoResponsaDetaSiniestro === '2' || // Responsabilidad = Compartida
          vm.frm.codigoResponsaDetaSiniestro === '3') // Responsabilidad = Asegurado
      ) {
        vm.disabledAcuerdoEntreConductores = false;
        if (vm.frm.tab5.acuerdoEntreConductores && vm.frm.tab5.acuerdoEntreConductores.codigoValor === 71) {
          vm.disabledCompaniaSeguro = false;
          vm.disabledPlaca = false;
        } else {
          vm.disabledCompaniaSeguro = true;
          vm.disabledPlaca = true;
          setEmptyCompaniaSeguro();
          setEmptyPlaca();
        }
      } else {
        vm.disabledPlaca = true;
        vm.disabledAcuerdoEntreConductores = true;
        vm.disabledCompaniaSeguro = true;
        setEmptyPlaca();
        setEmptyCompaniaSeguro();
        setEmptyAcuerdoEntreConductores();
      }

      checkAplicaConvenio();
      checkMensajeIncomplete();
    }

    function checkAplicaConvenio() {
      if (
        (vm.frm.codigoResponsaDetaSiniestro === '1' ||
          vm.frm.codigoResponsaDetaSiniestro === '2' ||
          vm.frm.codigoResponsaDetaSiniestro === '3') &&
        vm.frm.siniestroConvenio.codigoConvenioGolpe === 71 &&
        vm.frm.siniestroConvenio.codigoEmpresaAseguradora != 0 &&
        vm.frm.siniestroConvenio.numeroPlaca != '-' &&
        vm.frm.siniestroConvenio.numeroPlaca != ''
      ) {
        vm.frm.siniestroConvenio.aplicaConvenio = true;
      } else {
        vm.frm.siniestroConvenio.aplicaConvenio = false;
      }
    }

    function mapStateToThis(state) {
      return {
        frm: _.merge({}, state.detalle),
        frmsValidationStates: ng.copy(state.frmsValidationStates),
        isFrmRequire: state.frmStatus.require,
        statusBlock: state.frmStatus
      };
    }

    function watcherFrmRequire() {
      watchFrmRequire = $scope.$watch('$ctrl.isFrmRequire', function (nv) {
        if (nv) {
          vm.frmSiniestroObj.markAsPristine();
        }
      });
    }

    function _autoUpdate() {
      updateIntervalPromise = $interval(function () {
        if (wpFactory.help.isObjDifferent(oldFrm, vm.frm)) {
          oldFrm = ng.copy(vm.frm);
          vm.rdxDetalleUpdate(oldFrm);
          vm.rdxFrmsValidate({ siniestro: vm.frmSiniestroObj.$valid });
          vm.rdxFrmSaved(false);
        }
      }, wpConstant.timeToUpdate);
    }

    function servicePhotoModal(photo) {
      return wpFactory.siniestro.ViewImageByPath(photo.nombreFisico, 0);
    }

    function _loadAllFotos(fotosCroquis, fotosOtros) {
      _loadFotosCroquis(fotosCroquis);
      _loadFotosOtros(fotosOtros);
    }

    // croquis

    function _loadFotosCroquis(fotosSiniestro) {
      _loadFotos(fotosSiniestro, 'fotosCroquis');
    }

    function subirFotosCroquis(event) {
      _subirFotos(event, 'fotosCroquis', 20);
    }

    function eliminarFotoCroquis(event) {
      _eliminarFoto(event, 'fotosCroquis');
    }

    // otros

    function _loadFotosOtros(fotosSiniestro) {
      _loadFotos(fotosSiniestro, 'fotosOtros');
    }

    function subirFotosOtros(event) {
      _subirFotos(event, 'fotosOtros', 21);
    }

    function eliminarFotoOtros(event) {
      _eliminarFoto(event, 'fotosOtros');
    }

    // helpers

    function _loadFotos(arrFotos, prop) {
      _.forEach(arrFotos, function feFn(item, idx) {
        if (item && item.nombreFisico) {
          wpFactory.siniestro.ViewImageByPath(item.nombreFisico).then(function (resp) {
            wpFactory.help.isCode200(resp) ? (vm[prop][idx].srcImg = resp.data) : (vm[prop][idx] = null);
          });
        }
      });
    }

    function _subirFotos(event, propWhereSave, imageTypeCode) {
      wpFactory.siniestro.UploadSinisterDetail(event.photoToUpload, imageTypeCode).then(function ucsPr(resp) {
        vm.frm.fotosDetaSiniestro = wpFactory.help.getArrayFotosNuevas(
          vm.frm.fotosDetaSiniestro,
          resp,
          event.photoData
        );
        vm[propWhereSave] = wpFactory.help.getFotosConB64(vm[propWhereSave], resp, event.photoData);
      });
    }

    function _eliminarFoto(event, propWhereSave) {
      wpFactory.siniestro.DeleteImages(event.photoToRemove.nombreFisico);
      vm[propWhereSave].splice(event.idx, 1);
      vm.frm.fotosDetaSiniestro = [].concat(vm[propWhereSave]);
    }
  } // end controller

  return ng
    .module('appWp')
    .controller('DetalleSiniestroController', DetalleSiniestroController)
    .component('wpDetalleSiniestro', {
      templateUrl: '/webproc/app/components/detalle-asistencia/detalle-siniestro/detalle-siniestro.html',
      controller: 'DetalleSiniestroController',
      bindings: {}
    });
});