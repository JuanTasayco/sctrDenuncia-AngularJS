define([
  'angular', 'constants', 'constantsRiesgosGenerales', 'rrggModalProductParameter', '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js',
], function (ng, constants, constantsRiesgosGenerales) {
  TrabajosEspecificosController.$inject = ['$scope','mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', '$filter', '$uibModal', 'riesgosGeneralesCommonFactory', 'mModalConfirm'];
  function TrabajosEspecificosController($scope,mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, $filter, $uibModal, riesgosGeneralesCommonFactory, mModalConfirm) {
    var vm = this;
    vm.producto = {};
    // Funciones
    vm.validControlForm = ValidControlForm;
    vm.validateMonto = ValidateMonto;
    vm.clearInputSumas = clearInputSumas;
    vm.OpenParametros = OpenParametros;
    vm.validateDescuentos = validateDescuentos;
    vm.changeDesde = changeDesde;
    vm.ubigeoValid = {}; 
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesFactory.setCotizacionProducto(vm.cotizacion);
      vm.producto = riesgosGeneralesFactory.cotizacion.producto;
      vm.format = constants.formats.dateFormat;
      vm.fechaActual = new Date();
      vm.validadores = {
        minStartDate: new Date(),
        minStartDateFormat: riesgosGeneralesFactory.formatearFecha(new Date())
      }
      vm.producto.modelo = {
        Ubigeo: {
          mDepartamento: null,
          mProvincia: null,
          mDistrito: null
        },
        RcPatronal: "1",
        RcContractual: "1",
        AdicionarTercero: "0",
        Ingresatrabajadores: "0",
        EndosarDeshonestidad: "0",
        FechaDesde: new Date(),
        FechaHasta: new Date(vm.fechaActual.setDate(vm.fechaActual.getDate() + 365))
      }

      $scope.$watch('setter', function() {
        $scope.setterUbigeo = $scope.setter;
      })
      $scope.$on('ubigeo', function(_, data) {
        if(data) {
          riesgosGeneralesService.getRestriccionUbigeo(data.mDepartamento,data.mProvincia,data.mDistrito)
          .then(function (response) {
            var restringido = response.Data.Restringido
            if (restringido) {
              mModalAlert.showWarning("La cotización debe pasar por VoBo de Suscripción, debido a que la ubicación del riesgo se encuentra en zona restringida.", "MAPFRE: RESTRICCIÓN DE UBICACIÓN DE RIESGO");
            }
          })
        }
      })
      $scope.$watch('clean', function() {
        $scope.cleanUbigeo = $scope.clean;
      })
      
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.RAMO)
        .then(function (response) {
          vm.ramo = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.TRABAJO_OBRA)
        .then(function (response) {
          vm.trabajoObra = response.Data;
        });
      riesgosGeneralesService.getCurrencyType(false)
        .then(function (response) {
          vm.monedas = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.TIP_CAMBIO)
        .then(function (response) {
          vm.producto.modelo.tipoCambio = response.Data[0].Valor
        });
      if (riesgosGeneralesFactory.getEditarCotizacion()) {
        vm.producto.modelo = vm.cotizacion.form;
        vm.producto.modelo.FechaDesde = new Date(vm.cotizacion.form.FechaDesde)
        vm.producto.modelo.FechaHasta = new Date(vm.cotizacion.form.FechaHasta)
        if (vm.cotizacion.form.SumaAseguradaDesh)
          vm.producto.modelo.SumaAseguradaDesh = vm.cotizacion.form.SumaAseguradaDesh.toFixed(2)
        if (vm.cotizacion.form.SumaAsegurada)
          vm.producto.modelo.SumaAsegurada = vm.cotizacion.form.SumaAsegurada.toFixed(2)
        if (vm.cotizacion.form.ValorContrato)
          vm.producto.modelo.ValorContrato = vm.cotizacion.form.ValorContrato.toFixed(2)
      }
    };
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
    function clearInputSumas(value) {
      if (value === vm.constantsRrgg.RAMO.RESPON_CIVIL)
        vm.producto.modelo.SumaAseguradaDesh = ""
      if (value === vm.constantsRrgg.RAMO.DESHONESTIDAD)
        vm.producto.modelo.SumaAsegurada = ""
    }
    function ValidateMonto(value, input) {
      value =  riesgosGeneralesCommonFactory.formatMilesToNumber(value);
      var parametro, codigoParam, cabeceraSms;
      switch (input) {
        case constantsRiesgosGenerales.VAL_CONTRATO:
          parametro = vm.constantsRrgg.PARAMETROS.VAL_MAX_CONTRATO.COD
          codigoParam = vm.constantsRrgg.PARAMETROS.VAL_MAX_CONTRATO.MONTO_MAX_DOL
          cabeceraSms = vm.constantsRrgg.CABECERA_ALERTAS.TXT_1
          break;
        case constantsRiesgosGenerales.RAMO.RESPON_CIVIL:
          parametro = vm.constantsRrgg.PARAMETROS.SUM_MAX_ASEGURADA
          codigoParam = vm.constantsRrgg.PARAMETROS.VAL_MAX_CONTRATO.RESPON_MAX_DOL
          cabeceraSms = vm.constantsRrgg.CABECERA_ALERTAS.TXT_2
          break;
        case constantsRiesgosGenerales.RAMO.DESHONESTIDAD:
          parametro = vm.constantsRrgg.PARAMETROS.SUM_MAX_ASEGURADA
          codigoParam = vm.constantsRrgg.PARAMETROS.VAL_MAX_CONTRATO.DESH_MAX_DOL
          cabeceraSms = vm.constantsRrgg.CABECERA_ALERTAS.TXT_2
          break;
      }
      var paramData = {
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        value: value,
        input: input,
        cabeceraSms: cabeceraSms,
        codigoParam: codigoParam,
        parametro: parametro,
        type: "C",
        moneda: vm.producto.modelo.Moneda,
        tipoCambio: vm.cotizacion.tipoCambio
      }
      riesgosGeneralesCommonFactory.validateMontoMaximoTEE(paramData)
    }
    function OpenParametros() {
      var vModalSendEmail = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        windowClass: "g-modal-size",
        template: '<rrgg-modal-product-parameter cotizacion="cotizacion"  title="title" close="close()"></rrgg-modal-product-parameter>',
        controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
          $scope.title = constantsRiesgosGenerales.PROD_TITLE.TRAB_ESPECIFICOS;
          $scope.cotizacion = vm.cotizacion;
          $scope.close = function () {
            $uibModalInstance.close();
          };
        }]
      });
      vModalSendEmail.result.then(function () {
      }, function () {
      });
    }
    function validateDescuentos() {
      var paramData = {
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        SumaAsegurada: vm.producto.modelo.SumaAsegurada,
        DescuentoDirector: vm.producto.modelo.DescuentoDirector,
        type: "C",
        moneda: vm.producto.modelo.Moneda
      }
      riesgosGeneralesCommonFactory.validateDescuentosTEE(paramData);
    }
    function changeDesde() {
      riesgosGeneralesService.validacionFecha(riesgosGeneralesFactory.FormatearFechaMes(vm.producto.modelo.FechaDesde), vm.cotizacion.producto.CodigoRiesgoGeneral).then(function (response) {
        var nuevaFechaDesde = angular.copy(new Date(vm.producto.modelo.FechaDesde))
        vm.producto.modelo.FechaHasta = riesgosGeneralesCommonFactory.addDay(vm.producto.modelo.FechaDesde, 365);
        if (!response.Data) {
          mModalConfirm.confirmInfo("SOLICITAR VoBo DE SUSCRIPCIÓN Y ADJUNTAR CARTA DE NO SINIESTRO.", "¿Desea continuar?").then(function (response) {
            vm.producto.nuevafechatemporal = new Date(vm.producto.modelo.FechaDesde);
          }).catch(function (err) {
            if(!vm.producto.nuevafechatemporal){
              vm.producto.modelo.FechaDesde = new Date();
            }else{
              vm.producto.modelo.FechaDesde = vm.producto.nuevafechatemporal
            }
            nuevaFechaDesde = angular.copy(vm.producto.modelo.FechaDesde);
            vm.producto.modelo.FechaHasta = riesgosGeneralesCommonFactory.addDay(vm.producto.modelo.FechaDesde, 365);
          })
        }else{
          vm.producto.nuevafechatemporal = new Date(vm.producto.modelo.FechaDesde);
        }
      });
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('trabajosEspecificosController', TrabajosEspecificosController)
    .component('trabajosEspecificos', {
      templateUrl: '/polizas/app/rrgg/components/trabajos-especificos/trabajos-especificos.component.html',
      controller: 'trabajosEspecificosController',
      bindings: {
        cotizacion: '=',
        form: '=?form',
        disabled: '=?ngDisabled'
      }
    })
});
