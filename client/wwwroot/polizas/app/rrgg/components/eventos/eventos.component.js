define([
  'angular', 'constantsRiesgosGenerales', '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js',
], function (ng, constantsRiesgosGenerales) {
  eventosController.$inject = ['$scope','mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'riesgosGeneralesCommonFactory', 'mModalConfirm', 'mainServices', '$uibModal', 'oimAbstractFactory'];
  function eventosController($scope,mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, riesgosGeneralesCommonFactory, mModalConfirm, mainServices, $uibModal, oimAbstractFactory) {
    var vm = this;
    vm.OpenParametros = OpenParametros;
    vm.validateMonto = validateMonto;
    vm.changeDesdeEvento = changeDesdeEvento;
    vm.validControlForm = ValidControlForm;
    vm.validateEventos = validateEventos;
    vm.ubigeoValid = {}; 
    vm.isMydream = oimAbstractFactory.isMyDream();
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesFactory.setCotizacionProducto(vm.cotizacion);
      vm.producto = riesgosGeneralesFactory.cotizacion.producto;
      vm.format = constants.formats.dateFormat;
      vm.fechaActual = new Date();
      vm.sumaAseguradaPreviaRC = null;
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
        FechaEventoDesde: new Date(),
        FechaHasta: riesgosGeneralesCommonFactory.addDay(vm.fechaActual, 15),
        FechaEventoHasta : riesgosGeneralesCommonFactory.addDay(vm.fechaActual, 90)
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

        setTimeout(function() {
          vm.producto.modelo.Ubigeo = {
            mDepartamento: vm.cotizacion.form.Departamento,
            mProvincia: vm.cotizacion.form.Provincia,
            mDistrito: vm.cotizacion.form.Distrito
          }
        }, 500);

        vm.producto.modelo.FechaDesde = new Date(vm.cotizacion.form.FechaInicioVig)
        vm.producto.modelo.FechaHasta = new Date(vm.cotizacion.form.FechaFinVig)
        vm.producto.modelo.FechaEventoDesde = new Date(vm.cotizacion.form.FechaEventoDesde)
        vm.producto.modelo.FechaEventoHasta = new Date(vm.cotizacion.form.FechaEventoHasta)
        vm.producto.modelo.ObraRealizar = vm.cotizacion.form.Evento
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
          $scope.title = constantsRiesgosGenerales.PROD_TITLE.EVENTOS;
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
        codCabeceraParam: vm.constantsRrgg.PARAMETROS.SUM_MAX_ASEGURADA,
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        sumaAsegurada: riesgosGeneralesCommonFactory.formatMilesToNumber(sumaAsegurada),
        moneda: vm.producto.modelo.Moneda,
        type: "C"
      }
      riesgosGeneralesCommonFactory.validateMontoMaximoParamSimple(paramData).then(function (response) {
        if(response===0 || response){
          vm.sumaAseguradaPreviaRC = sumaAsegurada
        }
        else if(!response){
          vm.producto.modelo.SumaAsegurada =  vm.sumaAseguradaPreviaRC;
        }
      })
    }

    function changeDesdeEvento() {
      riesgosGeneralesService.validacionFecha(riesgosGeneralesFactory.FormatearFechaMes(vm.producto.modelo.FechaEventoDesde), vm.cotizacion.producto.CodigoRiesgoGeneral).then(function (response) {
        var nuevaFechaDesde = angular.copy(new Date(vm.producto.modelo.FechaEventoDesde))
        vm.producto.modelo.FechaEventoHasta = riesgosGeneralesCommonFactory.addDay(vm.producto.modelo.FechaEventoDesde, 90);
        if (!response.Data) {
          mModalConfirm.confirmInfo("SOLICITAR VoBo DE SUSCRIPCIÓN Y ADJUNTAR CARTA DE NO SINIESTRO.", "¿Desea continuar?").then(function (response) {
            vm.producto.nuevafechatemporal = new Date(vm.producto.modelo.FechaEventoDesde);
          }).catch(function (err) {
            if(!vm.producto.nuevafechatemporal){
              vm.producto.modelo.FechaEventoDesde = new Date();
            }else{
              vm.producto.modelo.FechaEventoDesde = vm.producto.nuevafechatemporal
            }
            nuevaFechaDesde = angular.copy(vm.producto.modelo.FechaEventoDesde);
            vm.producto.modelo.FechaEventoHasta = riesgosGeneralesCommonFactory.addDay(vm.producto.modelo.FechaEventoDesde, 90);
          })
        }else{
          vm.producto.nuevafechatemporal = new Date(vm.producto.modelo.FechaEventoDesde);
        }
      });
    }

    function validateEventos(){
        var days = riesgosGeneralesCommonFactory.dayDiff(vm.producto.modelo.FechaEventoDesde, vm.producto.modelo.FechaEventoHasta);
        if (days > 184) {
          mModalConfirm.confirmInfo("Se está superando el tiempo máximo del Evento, 6 meses. <br/> Para un tiempo mayor, solicitar VoBo al Área de Suscripción." +
            "<br/> ¿Desea continuar?", "TIEMPO MÁXIMO DE VIGENCIAS", "Aceptar").then(function (response) {
            }).catch(function (err) {
              vm.producto.modelo.FechaEventoHasta = ""
            })
        }
    }
    
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
  }
  return ng.module('appRrgg')
    .controller('eventosController', eventosController)
    .component('eventos', {
      templateUrl: '/polizas/app/rrgg/components/eventos/eventos.component.html',
      controller: 'eventosController',
      bindings: {
        cotizacion: '=',
        form: "=?form"
      }
    })
});
