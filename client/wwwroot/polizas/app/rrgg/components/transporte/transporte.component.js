define([
  'angular', 'constantsRiesgosGenerales', '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js'
], function (ng, constantsRiesgosGenerales) {
  transporteController.$inject = ['$scope','mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'riesgosGeneralesCommonFactory', 'mModalConfirm', '$uibModal', 'oimAbstractFactory'];
  function transporteController($scope,mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, riesgosGeneralesCommonFactory, mModalConfirm, $uibModal, oimAbstractFactory) {
    var vm = this;
    vm.producto = {};
    vm.validControlForm = ValidControlForm;
    vm.OpenParametros = OpenParametros;
    vm.validateMonto = validateMonto;
    vm.changeDesde = changeDesde;
    vm.ramoSelected = ramoSelected;
    vm.sumaAseguradaPrevia = null;
    vm.isMydream = oimAbstractFactory.isMyDream();

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
        DuracionDesde: new Date(),
        BaseValorizacion: "Según Factura comercial.",
        radioAccion: ""
      }


      $scope.$watch('$ctrl.producto.setter', function() {
        vm.setterUbigeo = vm.producto.setter;
        if(vm.setterUbigeo && vm.cotizacion.form && vm.cotizacion.form.Departamento){
          vm.setterUbigeo(
            vm.cotizacion.form.Departamento.Codigo,
            vm.cotizacion.form.Provincia.Codigo,
            vm.cotizacion.form.Distrito.Codigo);
        }
      })

      $scope.$on('ubigeo', function(_, data) {
        if(data) {
          riesgosGeneralesService.getRestriccionUbigeo(vm.cotizacion.producto.CodigoRiesgoGeneral, data.mDepartamento,data.mProvincia,data.mDistrito)
          .then(function (response) {
            const restringido = response.Data.Restringido
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
        });
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.TIP_CAMBIO)
        .then(function (response) {
          vm.producto.modelo.tipoCambio = response.Data[0].Valor
        });
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.RAMO)
        .then(function (response) {
          vm.ramo = response.Data;
          if (riesgosGeneralesFactory.getEditarCotizacion()) {
            vm.ramoSelect = vm.ramo.find(function (data) { return data.Codigo === vm.cotizacion.form.Ramo.Codigo });
            vm.ramoSelected(vm.ramoSelect);
          }
        });
      if (riesgosGeneralesFactory.getEditarCotizacion()) {
        vm.producto.modelo = vm.cotizacion.form;

        setTimeout(function() {
          vm.producto.modelo.Ubigeo = {
            mDepartamento: vm.cotizacion.form.Departamento,
            mProvincia: vm.cotizacion.form.Provincia,
            mDistrito: vm.cotizacion.form.Distrito
          }
        }, 500);

        vm.producto.modelo.DuracionDesde = new Date(vm.cotizacion.form.DuracionDesde);
        vm.producto.modelo.DuracionHasta = new Date(vm.cotizacion.form.DuracionHasta);
        vm.producto.modelo.RadioAccionDesde = vm.cotizacion.form.RadioAccionDesde || null;
        vm.producto.modelo.RadioAccionHasta = vm.cotizacion.form.RadioAccionHasta || null;
        vm.producto.modelo.CodigoRadio = {
          Codigo: vm.cotizacion.form.CodigoRadio || null
        }
      }
    };
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
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
          $scope.title = constantsRiesgosGenerales.PROD_TITLE.TRANSPORTE;
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
    function validateMonto(sumaAsegurada) {
      var paramData = {
        Grupo: vm.cotizacion.producto.Grupo,
        codCabeceraParam: vm.constantsRrgg.PARAMETROS.CONSIDERACIONES,
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        sumaAsegurada: riesgosGeneralesCommonFactory.formatMilesToNumber(sumaAsegurada),
        moneda: vm.producto.modelo.Moneda,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validateMontoMaximoParamSimple(paramData).then(function (response) {
        if (response === 0 || response) {
          vm.sumaAseguradaPrevia = sumaAsegurada;
        }
        else if (!response) {
          vm.producto.modelo.SumaAsegurada = vm.sumaAseguradaPrevia;
        }
      });
    }

    function changeDesde() {
      riesgosGeneralesService.validacionFecha(riesgosGeneralesFactory.FormatearFechaMes(vm.producto.modelo.DuracionDesde), vm.cotizacion.producto.CodigoRiesgoGeneral).then(function (response) {
        var nuevaFechaDesde = angular.copy(new Date(vm.producto.modelo.DuracionDesde))
        if (!response.Data) {
          mModalConfirm.confirmInfo("SOLICITAR VoBo DE SUSCRIPCIÓN Y ADJUNTAR CARTA DE NO SINIESTRO.", "¿Desea continuar?").then(function (response) {
            vm.producto.nuevafechatemporal = new Date(vm.producto.modelo.DuracionDesde);
          }).catch(function (err) {
            if (!vm.producto.nuevafechatemporal) {
              vm.producto.modelo.DuracionDesde = new Date();
            } else {
              vm.producto.modelo.DuracionDesde = vm.producto.nuevafechatemporal
            }
            nuevaFechaDesde = angular.copy(vm.producto.modelo.DuracionDesde);
          })
        } else {
          vm.producto.nuevafechatemporal = new Date(vm.producto.modelo.DuracionDesde);
        }
      });
    }

    function ramoSelected(ramo) {
      vm.embalaje = ramo.Detalle.filter(function (data) { return data.Valor === "" });
      vm.radioAccion = ramo.Detalle.filter(function (data) { return data.Valor.trim() === "RADIO_ACCION" });
    }
  }
  return ng.module('appRrgg')
    .controller('transporteController', transporteController)
    .component('transportes', {
      templateUrl: '/polizas/app/rrgg/components/transporte/transporte.component.html',
      controller: 'transporteController',
      bindings: {
        cotizacion: '=',
        form: "=?form"
      }
    })
});
