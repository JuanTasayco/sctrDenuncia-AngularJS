define([
  'angular', 'constantsRiesgosGenerales', 'equipos', 'rrggModalProductParameter'
], function (ng, constantsRiesgosGenerales) {
  TrecController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory', 'riesgosGeneralesCommonFactory', '$uibModal','mModalConfirm', 'oimAbstractFactory'];
  function TrecController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory, riesgosGeneralesCommonFactory, $uibModal,mModalConfirm, oimAbstractFactory) {
    var vm = this;
    // Propiedades
    vm.dataSourceNumeroEquipos = []
    vm.producto = {};
    // Funciones
    vm.validControlForm = ValidControlForm;
    vm.addFileEquipos = AddFileEquipos;
    vm.validateDescuentos = validateDescuentos
    vm.OpenParametros = OpenParametros;
    vm.validateTipTrabajo = validateTipTrabajo
    vm.validaMonto = validaMonto
    vm.isMydream = oimAbstractFactory.isMyDream();

    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      riesgosGeneralesFactory.setCotizacionProducto(vm.cotizacion);
      vm.producto = riesgosGeneralesFactory.cotizacion.producto;
      vm.producto.modelo = {
        EndosaDeshonestidad: 0,
        AseguraAdicional: 0,
        listaEquipos: [],
        TrabajaGoldfields: { Codigo: "N" },
        ContrataRc: { Codigo: "S" },
        ContrataNac: { Codigo: "S" },
        ContrataMed: { Codigo: "S" },
      }
      vm.dataSourceNumeroEquipos = riesgosGeneralesFactory.getSourceNumeroEquipos();
      riesgosGeneralesService.getCurrencyType(false)
        .then(function (response) {
          vm.monedas = response.Data;
        })
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.TRABAJO_OBRA)
        .then(function (response) {
          vm.tipoTrabajo = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.UN_SOLO_EQUIPO)
        .then(function (response) {
          vm.unEquipo = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(vm.cotizacion.producto.CodigoRiesgoGeneral, vm.constantsRrgg.PARAMETROS.VIGENCIA)
        .then(function (response) {
          vm.vigencia = response.Data;
        });
      riesgosGeneralesService.getProxyPametros(0, vm.constantsRrgg.PARAMETROS.TIP_CAMBIO)
        .then(function (response) {
          vm.producto.modelo.tipoCambio = response.Data[0].Valor
        });
      if (riesgosGeneralesFactory.getEditarCotizacion()) {
        vm.producto.modelo = vm.cotizacion.form
        vm.producto.modelo.CantidadElementos = {
          Valor: vm.cotizacion.form.CantidadElementos
        }
        vm.producto.modelo.ContrataRc = { Codigo: vm.cotizacion.form.ContrataRc }
        vm.producto.modelo.ContrataNac = { Codigo: vm.cotizacion.form.ContrataNac }
        vm.producto.modelo.ContrataMed = { Codigo: vm.cotizacion.form.ContrataMed }
        vm.producto.modelo.TrabajaGoldfields = { Codigo: vm.cotizacion.form.TrabajaGoldfields }
        vm.producto.modelo.UnEquipo = { Codigo: vm.cotizacion.form.UnEquipo }
      }
    };
    function AddFileEquipos($selected) {
      if (vm.form.moneda.$valid) {
        vm.invalidMoneda = false;
        var cantAsegurados = vm.producto.modelo.listaEquipos.length;
        var defultAsegurado = {
          item: ''
        };
        if (cantAsegurados < $selected.Valor) {
          for (var index = (cantAsegurados + 1); index <= $selected.Valor; index++) {
            vm.producto.modelo.listaEquipos.push(angular.copy(angular.extend({ Orden: index }, defultAsegurado)))
          }
        } else {
          vm.producto.modelo.listaEquipos = vm.producto.modelo.listaEquipos.slice(0, $selected.Valor);
        }
      } else {
        vm.invalidMoneda = true
        vm.producto.modelo.CantidadElementos = null
      }
    }
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
    function validateDescuentos() {
      var paramData = {
        CodigoRiesgoGeneral: vm.cotizacion.producto.CodigoRiesgoGeneral,
        DescuentoDirector: vm.producto.modelo.DescuentoDirector,
        type: "C",
        moneda: vm.producto.modelo.Moneda
      }
      riesgosGeneralesCommonFactory.validateDescuentosTRE(paramData);
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
          $scope.title = constantsRiesgosGenerales.PROD_TITLE.TREC;
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
    function validateTipTrabajo(){
      if(vm.producto.modelo.TipoTrabajo.Estado === "99"){
        mModalAlert.showWarning("Tipo de trabajo fuera de parámetros del producto, para cotizar debe solicitar el VoBo de Suscripción", "MAPFRE");
      }
    }
    function validaMonto(){
      if(vm.producto.modelo.SumaAsegurada){
        if (
          (parseInt(vm.producto.modelo.SumaAsegurada)>700000 && parseInt(vm.producto.modelo.Moneda.Codigo)===1) ||
          (parseInt(vm.producto.modelo.SumaAsegurada)>250000 && parseInt(vm.producto.modelo.Moneda.Codigo)===2)
        ){
          mModalConfirm.confirmInfo("El límite de S.A para RC es de US$ 250000 o S/ 700.000 según sea T.C","Suma Asegurada Rc Máx").then(
          ).catch (function(err){
            vm.producto.modelo.SumaAsegurada = vm.producto.modelo.SumaAseguradaAux || 0
          })
        } 
      }
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('trecController', TrecController)
    .component('trec', {
      templateUrl: '/polizas/app/rrgg/components/trec/trec.component.html',
      controller: 'trecController',
      bindings: {
        cotizacion: '=',
        form: '=?form'
      }
    })
});
