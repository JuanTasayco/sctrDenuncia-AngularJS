define([
  'angular', 'constantsRiesgosGenerales', 'rrggModalProductParameter'
], function (ng, constantsRiesgosGenerales) {
  vigLimpController.$inject = ['mModalAlert', '$uibModal', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'riesgosGeneralesCommonFactory', 'mModalConfirm'];
  function vigLimpController(mModalAlert, $uibModal, riesgosGeneralesService, riesgosGeneralesFactory, riesgosGeneralesCommonFactory, mModalConfirm) {
    var vm = this;
    vm.OpenParametros = OpenParametros;
    vm.validControlForm = ValidControlForm;
    vm.validateDescuentos = validateDescuentos;
    vm.validateMonto = validateMonto;
    vm.changeDesde = changeDesde;
    vm.changeHasta = changeHasta;
    vm.clearInputSumas = clearInputSumas;
    vm.validateUbicaciones = validateUbicaciones;
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesFactory.setCotizacionProducto(vm.cotizacion);
      vm.producto = riesgosGeneralesFactory.cotizacion.producto;
      vm.format = constants.formats.dateFormat;
      vm.format = constants.formats.dateFormat;
      vm.fechaActual = new Date();
      vm.sumaAseguradaPrevia = null;
      vm.validadores = {
        minStartDate: new Date(),
        minStartDateFormat: riesgosGeneralesFactory.formatearFecha(new Date())
      }
      vm.producto.modelo = {
        UsasArmas: "0",
        MasUbicaciones: "0",
        Ingresatrabajadores: "0",
        AdicionarTercero: "0",
        EndosaDeshonestidad: "0",
        DuracionDesde: new Date(),
        DuracionHasta: new Date(vm.fechaActual.setDate(vm.fechaActual.getDate() + 365))
      }
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.ACTI_REALIZA)
        .then(function (response) {
          vm.actividad = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.RAMO)
        .then(function (response) {
          vm.ramo = response.Data;
        });
      riesgosGeneralesService.getCurrencyType(false)
        .then(function (response) {
          vm.monedas = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.TIP_CAMBIO)
        .then(function (response) {
          vm.producto.modelo.tipoCambio = response.Data[1].Valor
        });
      if (riesgosGeneralesFactory.getEditarCotizacion()) {
        vm.producto.modelo = vm.cotizacion.form
        vm.producto.modelo.DuracionDesde = new Date(vm.cotizacion.form.DuracionDesde)
        vm.producto.modelo.DuracionHasta = new Date(vm.cotizacion.form.DuracionHasta)
        vm.producto.modelo.DescuentoDirector = vm.cotizacion.form.DescuentoDirector ? vm.cotizacion.form.DescuentoDirector.toString() : vm.cotizacion.form.DescuentoDirector;
      }
    };
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
    function clearInputSumas(value) {
      if (value === vm.constantsRrgg.RAMO.RESPON_CIVIL)
        vm.producto.modelo.SumaAseguradaDesh = ""
      if (value === vm.constantsRrgg.RAMO.DESHONESTIDAD)
        vm.producto.modelo.SumaAseguradaRC = ""
    }
    function validateDescuentos() {
      var paramData = {
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        DescuentoDirector: vm.producto.modelo.DescuentoDirector,
        CantidadTrabajadores: vm.producto.modelo.CantidadTrabajadores,
        moneda: vm.producto.modelo.Moneda,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validateDescuentosVIG(paramData);
    }
    function validateMonto(sumaAsegurada,tipo) {
      var paramData = {
        Grupo: vm.cotizacion.producto.Grupo,
        codCabeceraParam: vm.constantsRrgg.PARAMETROS.T_NETA_ANUAL,
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        sumaAsegurada: riesgosGeneralesCommonFactory.formatMilesToNumber(sumaAsegurada),
        moneda: vm.producto.modelo.Moneda,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validateMontoMaximoParamTabla(paramData).then(function (response) {
        if(response===0 || response){
          if(tipo==="RC"){
            vm.sumaAseguradaPreviaRC = sumaAsegurada;
          }
          else{
            vm.sumaAseguradaPreviaDes = sumaAsegurada;
          }
        }
        else if(!response){
          if(tipo==="RC"){
            vm.producto.modelo.SumaAseguradaRC =  vm.sumaAseguradaPreviaRC;
          }
          else{
            vm.producto.modelo.SumaAseguradaDesh = vm.sumaAseguradaPreviaDes;
          }
        }
      });;
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
          $scope.title = constantsRiesgosGenerales.PROD_TITLE.VIGLIMP;
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
    function changeHasta() {
      var days = riesgosGeneralesCommonFactory.dayDiff(vm.producto.modelo.DuracionDesde, vm.producto.modelo.DuracionHasta);
      var paramData = {
        days: days,
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        Grupo: vm.cotizacion.producto.Grupo,
        FromDate: vm.producto.modelo.DuracionDesde,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validFechasMaximas(paramData).then(function (response) {
        vm.producto.modelo.DuracionHasta = "";
      });
    }
    
    
    function validateUbicaciones(value) {
      value = parseInt(value.trim());
      if (value < 1 || value > 20) {
        mModalConfirm.confirmWarning("EL NÚMERO MAXIMO DE UBICACIONES A DECLARAR ES DE 20 PARA EL PRESENTE PRODUCTO, SI SE REQUIERE DECLARAR MÁS DE 20 SOLICITAR A SUSCRIPCIÓN", "MAPFRE", "REINTENTAR").then(function (response) {
          vm.producto.modelo.CantidadUbicaciones = "";
        }).catch(function (error) {
          vm.producto.modelo.CantidadUbicaciones = "";
        });
      }

    }
  } // end controller
  return ng.module('appRrgg')
    .controller('vigLimpController', vigLimpController)
    .component('rrggVigLimpieza', {
      templateUrl: '/polizas/app/rrgg/components/vig-limpieza/vig-limpieza.component.html',
      controller: 'vigLimpController',
      bindings: {
        cotizacion: '=',
        form: '=?form',
      }
    })
});
