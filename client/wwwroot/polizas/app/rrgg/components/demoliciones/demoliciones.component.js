define([
  'angular', 'constantsRiesgosGenerales', '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js',
], function (ng, constantsRiesgosGenerales) {
  demolicionesController.$inject = ['$scope','mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'riesgosGeneralesCommonFactory', 'mainServices','$uibModal','mModalConfirm'];
  function demolicionesController($scope, mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, riesgosGeneralesCommonFactory, mainServices,$uibModal,mModalConfirm) {
    var vm = this;
    vm.OpenParametros = OpenParametros;
    vm.validateDescuentos = validateDescuentos;
    vm.validateMonto = validateMonto;
    vm.validControlForm = ValidControlForm;
    vm.changeDesde = changeDesde;
    vm.sumaAseguradaPrevia = null;
    vm.ubigeoValid = {}; 
    vm.$onInit = function ()  {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesFactory.setCotizacionProducto(vm.cotizacion);
      vm.producto = riesgosGeneralesFactory.cotizacion.producto;
      vm.format = constants.formats.dateFormat;
      vm.fechaActual = new Date();
      vm.descuentoPrevio = null;
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

      riesgosGeneralesService.getCurrencyType(false)
      .then(function (response) {
        vm.monedas = response.Data;
      })
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.RAMO)
      .then(function (response) {
        vm.ramo = response.Data;
      });
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.TIP_CAMBIO)
      .then(function (response) {
        vm.producto.modelo.tipoCambio = response.Data[0].Valor
      });
      if (riesgosGeneralesFactory.getEditarCotizacion()) {
        vm.producto.modelo = vm.cotizacion.form;
        vm.producto.modelo.FechaDesde = new Date(vm.cotizacion.form.FechaDesde)
        vm.producto.modelo.FechaHasta = new Date(vm.cotizacion.form.FechaHasta)
      }
    };
    function OpenParametros() {
      var vModalSendEmail = $uibModal.open({
        backdrop: true,
        backdropClick: true,
        dialogFade: false,
        keyboard: true,
        windowClass: "g-modal-size",
        template: '<rrgg-modal-product-parameter cotizacion="cotizacion"  title="title" close="close()"></rrgg-modal-product-parameter>',
        controller: ['$scope', '$uibModalInstance', '$uibModal', function ($scope, $uibModalInstance, $uibModal) {
          $scope.title = constantsRiesgosGenerales.PROD_TITLE.DEMOLICIONES;
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
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
    function validateDescuentos() {
      var paramData = {
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        SumaAsegurada:  riesgosGeneralesCommonFactory.formatMilesToNumber(vm.producto.modelo.SumaAsegurada),
        DescuentoDirector: vm.producto.modelo.DescuentoDirector,
        moneda: vm.producto.modelo.Moneda,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validateDescuentosDEM(paramData).then(function (response) {
        if(response===0 || response){
          vm.descuentoPrevio = vm.producto.modelo.DescuentoDirector;
        }
        else if(!response){
          vm.producto.modelo.DescuentoDirector =  vm.descuentoPrevio;
        }
      })
    }
    function validateMonto(sumaAsegurada) {
      var paramData = {
        Grupo: vm.cotizacion.producto.Grupo,
        codCabeceraParam : vm.constantsRrgg.PARAMETROS.T_NETA_ANUAL,
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        sumaAsegurada: riesgosGeneralesCommonFactory.formatMilesToNumber(sumaAsegurada),
        moneda: vm.producto.modelo.Moneda,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validateMontoMaximoParamTabla(paramData).then(function (response) {
        if (response === 0 || response) {
          vm.sumaAseguradaPrevia = sumaAsegurada;
        }
        else if (!response) {
          vm.producto.modelo.SumaAsegurada = vm.sumaAseguradaPrevia;
        }
      })
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

  }
  return ng.module('appRrgg')
    .controller('demolicionesController', demolicionesController)
    .component('demoliciones', {
      templateUrl: '/polizas/app/rrgg/components/demoliciones/demoliciones.component.html',
      controller: 'demolicionesController',
      bindings: {
        cotizacion: '=',
        form: "=?form"
      }
    })
});
