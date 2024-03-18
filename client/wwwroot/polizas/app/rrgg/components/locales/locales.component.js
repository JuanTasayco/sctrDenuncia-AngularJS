define([
  'angular', 'constants', 'constantsRiesgosGenerales', '/scripts/mpf-main-controls/components/ubigeo/component/ubigeo.js'
], function (ng, constants, constantsRiesgosGenerales) {
  localesController.$inject = ['$scope','mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory'];
  function localesController($scope,mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory) {
    var vm = this;
    vm.calcularPrimas = calcularPrimas;
    vm.deleteDatos = DeleteDatos
    vm.validControlForm = ValidControlForm
    vm.ubigeoValid = {};
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;

      setTimeout(function (){
        vm.data.listaUbicaciones.forEach(function (item){
          item.setter && item.setter(item.Departamento.Codigo,item.Provincia.Codigo,item.Distrito.Codigo)
          setTimeout(function(){
            item.Ubigeo = {
              mDepartamento: item.Departamento,
              mProvincia: item.Provincia,
              mDistrito: item.Distrito
      }
          }, 500)
    })
      }, 500)

    };

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
    function calcularPrimas() {
      if (_validateForm())
        riesgosGeneralesService.primas(riesgosGeneralesFactory.getModelPrimas()).then(function (response) {
          if (response.OperationCode === constants.operationCode.success) {
            vm.data.SumaAseguradaSoles = response.Data.SumaAseguradaSoles
            vm.data.SumaAseguradaDolares = response.Data.SumaAseguradaDolares
            vm.data.PrimaNeta = response.Data.PrimaNeta
            vm.data.PrimaTotal = response.Data.PrimaTotal
            vm.data.CantidadUit = response.Data.CantidadUit
            vm.data.PrimaNetaAmt = response.Data.amtTransporte.PrimaNeta
            vm.data.PrimaTotalAmt = response.Data.amtTransporte.PrimaTotal
            vm.data.NroVehiculosAmt = response.Data.amtTransporte.NroVehiculos
            vm.data.tasa = response.Data.Tasa
          } else {
            vm.data.PrimaNeta = "",
            vm.data.PrimaTotal = "",
            mModalAlert.showError(response.Message, "¡Error!")
          }
        })
    }
    function DeleteDatos(nroItem) {
      vm.data.listaUbicaciones.splice(nroItem, 1);
    }
    function _validateForm() {
      vm.form.markAsPristine();
      return vm.form.$valid;
    }
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('localesController', localesController)
    .component('locales', {
      templateUrl: '/polizas/app/rrgg/components/locales/locales.component.html',
      controller: 'localesController',
      bindings: {
        data: '=',
        validate: "=",
        aseguramiento: "=",
        form: '=?form'
      }
    })
});
