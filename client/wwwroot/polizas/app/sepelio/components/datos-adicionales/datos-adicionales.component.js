define([
  'angular', 'constantsSepelios'
], function (ng, constantsSepelios) {
  datosAdiconalesController.$inject = ['mModalAlert', 'campoSantoService', '$scope', 'campoSantoFactory','$timeout'];
  function datosAdiconalesController(mModalAlert, campoSantoService, $scope, campoSantoFactory, $timeout) {
    var vm = this;
    vm.isReadOnly = !campoSantoFactory.isPreemitidoEditable();
    vm.searchSedeFunerarias = searchSedeFunerarias;
    vm.changeSedeFuneraria = changeSedeFuneraria;
    vm.changeAgenciaFunerariaWithDelay = changeAgenciaFunerariaWithDelay;
    vm.changeVendedorFunerarioWithDelay = changeVendedorFunerarioWithDelay;
    vm.changeSupervisorNIWithDelay = changeSupervisorNIWithDelay;
    vm.getNumeroContratoGeneraro = getNumeroContratoGeneraro;
    vm.cotizacion.datosAdicionales.modelo = {
      nombreTipoContrato: vm.cotizacion.datosCotizacion.nombreTipoProducto,
      nombreProducto: vm.cotizacion.datosCotizacion.nombreProducto,
      nombreModalidad: vm.cotizacion.datosCotizacion.nombreModalidad,
      tipoEmision: null,
      numeroContrato: '',
      numeroContratoManual: (function () {
        if (vm.cotizacion.datosCotizacion.idRamo === 401)
          return 'S'
        else if (vm.cotizacion.datosCotizacion.idRamo === 400 && vm.cotizacion.datosCotizacion.idTipoProducto === 5)
          return 'N'
        else
          return 'S'
      })(),
      numeroContratoGenerado:'',
      fechaContrato: new Date(),
      numeroContratoRelacionado: vm.cotizacion.datosCotizacion.NumeroContratoRelacionado,
      agenciaFuneraria:null,
      vendedorFunerario:null,
      supervisorNI: null,
      camposanto:vm.cotizacion.datosCotizacion.nombreCampoSanto,
      ubicacion:'',
      sector:'',
      sitio:'',
      tamano:''
    };

    vm.format = constants.formats.dateFormat;
    vm.validadores = {
      minStartDate: subtractTimeFromDate(new Date(), 24 * 14),
      minStartDateFormat: campoSantoFactory.formatearFecha(new Date()),
      isNumContratoRelacionadoEnable: vm.cotizacion.datosCotizacion.idRamo === 401 && vm.cotizacion.datosCotizacion.idTipoProducto === 2 ? true : false,
      is400: vm.cotizacion.datosCotizacion.idRamo === 400 ? true : false
    };

    vm.combo = {
      tipoEmision: [{text: 'N', value: 'N'},{text: 'R', value: 'R'}],
      agenciaFuneraria: [],
      vendedorFunerario: [],
      supervisorNI: [],
    };

    vm.$onInit = function () {
      vm.constantsRrgg = constantsSepelios;
      campoSantoService.getDatosAdicionales(vm.cotizacion.datosCotizacion.idCotizacion)
      .then(function (response) {
        if(response.Data){
          vm.idAsociado = response.Data.idAsociado || 0;
          vm.cotizacion.datosAdicionales.idAsociado = vm.idAsociado;
          if (!!response.Data.idSede){
            vm.datosAdicionales = {codigoCategoria : response.Data.idSede , descripcion : response.Data.nombreSede} 
          }
          vm.cotizacion.datosAdicionales.idAsociado = vm.idAsociado;
          if (!!response.Data.idSede){
            vm.cotizacion.datosAdicionales.modelo.agenciaFuneraria = {
              CodAgencia: response.Data.idSede,
              NombreAgencia: response.Data.nombreSede
            };
          }
          if (!!response.Data.tipoEmision){
            vm.cotizacion.datosAdicionales.modelo.tipoEmision = {
              text: response.Data.tipoEmision, value: response.Data.tipoEmision
            };
          }
          vm.cotizacion.datosAdicionales.modelo.numeroContrato = response.Data.numeroContrato;
          vm.cotizacion.datosAdicionales.modelo.numeroContratoManual = response.Data.numeroContratoManual;
          vm.cotizacion.datosAdicionales.modelo.numeroContratoGenerado = response.Data.numeroContratoGenerado;
          if (response.Data.fechaContrato) vm.cotizacion.datosAdicionales.modelo.fechaContrato = new Date(response.Data.fechaContrato);
          if (response.Data.fechaInhumacion) vm.cotizacion.datosAdicionales.modelo.fechaInhumacion = new Date(response.Data.fechaInhumacion);
          if (!!response.Data.idVendedorFunarario){
            vm.cotizacion.datosAdicionales.modelo.vendedorFunerario = {
              codVendedor: response.Data.idVendedorFunarario,
              nombreCompleto: response.Data.nombreVendedor
            };
          }
          if (!!response.Data.idSupervidorNI){
            vm.cotizacion.datosAdicionales.modelo.supervisorNI = {
              codSupervisor: response.Data.idSupervidorNI,
              nombreCompleto: response.Data.nombreSupervidor
            };
          }
          vm.cotizacion.datosAdicionales.modelo.ubicacion = response.Data.codUbicacion,
          vm.cotizacion.datosAdicionales.modelo.sector = response.Data.codSector;
          vm.cotizacion.datosAdicionales.modelo.sitio = response.Data.sitio;
          vm.cotizacion.datosAdicionales.modelo.tamano = response.Data.tamanio;
        }
      });
      vm.userRoot =  campoSantoFactory.userRoot();
      vm.fnDelayTime = 0;
    };

    function changeAgenciaFunerariaWithDelay(text, searchSetup, cancelSearch) {
      if (!text) return;
      $timeout.cancel(vm.fnDelayTime);
      cancelSearch();
      vm.fnDelayTime = $timeout(function () { changeAgenciaFuneraria(text, searchSetup) }, 500);
    };

    function subtractTimeFromDate(objDate, intHours) {
      var numberOfMlSeconds = objDate.getTime();
      var addMlSeconds = (intHours * 60) * 60000;
      var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
      return newDateObj;
    }

    function changeAgenciaFuneraria(text, searchSetup){
      campoSantoService.getListAgencias(text)
      .then(function (response) {
        if(response.Data){
          vm.combo.agenciaFuneraria = response.Data.Lista;
          vm.cotizacion.datosAdicionales.modelo.vendedorFunerario = null;
          vm.combo.vendedorFunerario = [];
          searchSetup(text);
        }
      });
    }
    
    function changeVendedorFunerario(text, searchSetup){
      campoSantoService.getListVendedores(text)
      .then(function (response) {
        if(response.Data){
          vm.combo.vendedorFunerario = [];
          for (var index = 0; index < response.Data.Lista.length; index++) {
            var element = response.Data.Lista[index];
            vm.combo.vendedorFunerario.push({
              codVendedor: element.CodVendedor,
              nombreCompleto: element.Nombre + ' ' + element.ApellidoPaterno + ' ' + element.ApellidoMaterno
            });
          }
          if (response.Data.Lista.length === 0){
            vm.combo.vendedorFunerario.push({
              codVendedor: 40999,
              nombreCompleto: text.toUpperCase()
            });
          }
          searchSetup(text);
        }
      });
    }

    function changeVendedorFunerarioWithDelay(text, searchSetup, cancelSearch){
      if (!text) return;
      $timeout.cancel(vm.fnDelayTime);
      cancelSearch();
      vm.fnDelayTime = $timeout(function () { changeVendedorFunerario(text, searchSetup) }, 500);
    }

    function changeSupervisorNI(text, searchSetup){
      campoSantoService.getListVendedores(text)
      .then(function (response) {
        if(response.Data){
          vm.combo.supervisorNI = [];
          for (var index = 0; index < response.Data.Lista.length; index++) {
            var element = response.Data.Lista[index];
            vm.combo.supervisorNI.push({
              codSupervisor: element.CodVendedor,
              nombreCompleto: element.Nombre + ' ' + element.ApellidoPaterno + ' ' + element.ApellidoMaterno
            });
          }
          searchSetup(text);
        }
      });
    }

    function changeSupervisorNIWithDelay(text, searchSetup, cancelSearch){
      if (!text) return;
      $timeout.cancel(vm.fnDelayTime);
      cancelSearch();
      vm.fnDelayTime = $timeout(function () { changeSupervisorNI(text, searchSetup) }, 500);
    }

    function getNumeroContratoGeneraro(){
      if (vm.cotizacion.datosAdicionales.modelo.numeroContrato.length === 5){
        campoSantoService.generarNumeroPoliza(vm.cotizacion.datosCotizacion.idRamo, vm.cotizacion.datosCotizacion.idTipoProducto, vm.cotizacion.datosCotizacion.idCampoSanto, vm.cotizacion.datosAdicionales.modelo.numeroContrato)
        .then(function (response) {
          if(response.Data){
            vm.cotizacion.datosAdicionales.modelo.numeroContratoGenerado = response.Data;
          }
        });
      }
    }

    function searchSedeFunerarias(data) {
      if (data) {
        return campoSantoService.getSedeFunerarias(data);
      }
    };

    function changeSedeFuneraria(data) {
      if (!data) {
        delete $scope.formData.sedeFuneraria
      }
      else {
        $scope.formData.sedeFuneraria = data
      }
    };

  } // end controller
  return ng.module('appSepelio')
    .controller('datosAdiconalesController', datosAdiconalesController)
    .component('cpsDatosAdicionales', {
      templateUrl: '/polizas/app/sepelio/components/datos-adicionales/datos-adicionales.component.html',
      controller: 'datosAdiconalesController',
      bindings: {
        contratante: '=',
        cotizacion: '=',
        form: '=?form',
      }
    })
});
