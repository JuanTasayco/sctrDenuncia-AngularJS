define([
  'angular', 'constants', 'constantsRiesgosGenerales'
], function (ng, constants, constantsRiesgosGenerales) {
  vehiculosController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory'];
  function vehiculosController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory) {
    var vm = this;
    vm.calcularPrimas = calcularPrimas;
    vm.deleteDatos = DeleteDatos,
      vm.validControlForm = ValidControlForm
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
    };
    function DeleteDatos(nroItem) {
      vm.data.listaVehiculos.splice(nroItem, 1);
    }
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
    function _validateForm() {
      vm.form.markAsPristine();
      return vm.form.$valid;
    }
    function ValidControlForm(controlName) {
      return vm.form && riesgosGeneralesFactory.validControlForm(vm.form, controlName);
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('vehiculosController', vehiculosController)
    .component('vehiculos', {
      templateUrl: '/polizas/app/rrgg/components/vehiculos/vehiculos.component.html',
      controller: 'vehiculosController',
      bindings: {
        data: '=',
        validate: "=",
        clases: "=",
        aseguramiento: "=",
        form: '=?form'
      }
    })
});
