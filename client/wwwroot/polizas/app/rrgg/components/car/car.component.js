define([
  'angular', 'constantsRiesgosGenerales', 'rrggModalProductParameter', '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js',
], function (ng, constantsRiesgosGenerales) {
  carController.$inject = ['$scope', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'riesgosGeneralesCommonFactory', '$uibModal', 'mModalConfirm', 'mModalAlert'];
  function carController($scope, riesgosGeneralesService, riesgosGeneralesFactory, riesgosGeneralesCommonFactory, $uibModal, mModalConfirm, mModalAlert) {
    var vm = this;
    vm.validControlForm = ValidControlForm;
    vm.OpenParametros = OpenParametros;
    vm.currencyType = currencyType;
    vm.validateDescuentos = validateDescuentos;
    vm.changeDesde = changeDesde;
    vm.validateSumas = validateSumas;
    vm.validateMaximaDuracionCar = validateMaximaDuracionCar;
    vm.ubigeoValid = {}; 
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesFactory.setCotizacionProducto(vm.cotizacion);
      vm.producto = riesgosGeneralesFactory.cotizacion.producto;
      vm.format = constants.formats.dateFormat;
      vm.fechaActual = new Date();
      
      vm.producto.modelo = {
        Ubigeo: {
          mDepartamento: null,
          mProvincia: null,
          mDistrito: null
        },
        Endosatorio: "0",
        AseguradoAdicional: "0",
        DuracionDesde: new Date(),
        DuracionHasta: new Date(vm.fechaActual.setDate(vm.fechaActual.getDate() + 365))
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
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.TIP_PROYECTO)
        .then(function (response) {
          vm.tipoProyecto = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.TIP_CAMBIO)
        .then(function (response) {
          vm.producto.modelo.tipoCambio = response.Data[0].Valor
        });
      if (riesgosGeneralesFactory.getEditarCotizacion()) {
        vm.producto.modelo = vm.cotizacion.form
        vm.producto.modelo.DuracionDesde = new Date(vm.cotizacion.form.DuracionDesde)
        vm.producto.modelo.DuracionHasta = new Date(vm.cotizacion.form.DuracionHasta)
        vm.producto.modelo.DescuentoDirector = vm.cotizacion.form.DescuentoDirector ? vm.cotizacion.form.DescuentoDirector.toString() : vm.cotizacion.form.DescuentoDirector
      }
    };
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
    function currencyType(moneda) {
      return riesgosGeneralesFactory.currencyType(moneda)
    }
    function validateDescuentos() {
      var paramData = {
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        DescuentoDirector: vm.producto.modelo.DescuentoDirector,
        MontoObra: Math.round(riesgosGeneralesCommonFactory.formatMilesToNumber(vm.producto.modelo.MontoObra)),
        moneda: vm.producto.modelo.Moneda,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validateDescuentoCAR(paramData)
    }
    function validateSumas() {
      var paramData = {
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        MontoObra: riesgosGeneralesCommonFactory.formatMilesToNumber(vm.producto.modelo.MontoObra),
        moneda: vm.producto.modelo.Moneda,
        Grupo : vm.cotizacion.producto.Grupo,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validateMontosCAR(paramData)
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
          $scope.title = constantsRiesgosGenerales.PROD_TITLE.CAR;
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
    function changeDesde() {
      riesgosGeneralesService.validacionFecha(riesgosGeneralesFactory.FormatearFechaMes(vm.producto.modelo.DuracionDesde), vm.cotizacion.producto.CodigoRiesgoGeneral).then(function (response) {
        var nuevaFechaDesde = angular.copy(new Date(vm.producto.modelo.DuracionDesde))
        vm.producto.modelo.DuracionHasta = new Date(nuevaFechaDesde.setDate(nuevaFechaDesde.getDate() + 365))
        if (!response.Data) {
          mModalConfirm.confirmInfo("SOLICITAR VoBo DE SUSCRIPCIÓN Y ADJUNTAR CARTA DE NO SINIESTRO.", "¿Desea continuar?").then(function (response) {
            vm.producto.nuevafechatemporal = new Date(vm.producto.modelo.DuracionDesde);
          }).catch(function (err) {
            if(!vm.producto.nuevafechatemporal){
              vm.producto.modelo.DuracionDesde = new Date();
            }else{
              vm.producto.modelo.DuracionDesde = vm.producto.nuevafechatemporal
            }
            nuevaFechaDesde = angular.copy(vm.producto.modelo.DuracionDesde);
            vm.producto.modelo.DuracionHasta = new Date(nuevaFechaDesde.setDate(nuevaFechaDesde.getDate() + 365))
          })
        }else{
          vm.producto.nuevafechatemporal = new Date(vm.producto.modelo.DuracionDesde);
        }
      });
    }
    function validateMaximaDuracionCar() {
      var days = riesgosGeneralesCommonFactory.dayDiff(vm.producto.modelo.DuracionDesde, vm.producto.modelo.DuracionHasta);
      var paramData = {
        days: days,
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        Grupo: vm.cotizacion.producto.Grupo,
        FromDate: vm.producto.modelo.DuracionDesde,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validFechasMaximas(paramData).then(function (response) {
        if(vm.cotizacion.producto.Grupo === constantsRiesgosGenerales.GRUPO.CARLITE){
          vm.producto.modelo.DuracionHasta = ""
        }
      });
    }
    
  } // end controller
  return ng.module('appRrgg')
    .controller('carController', carController)
    .component('rrggCar', {
      templateUrl: '/polizas/app/rrgg/components/car/car.component.html',
      controller: 'carController',
      bindings: {
        cotizacion: '=',
        form: '=?form'
      }
    })
});