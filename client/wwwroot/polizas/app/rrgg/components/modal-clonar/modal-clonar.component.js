define([
  'angular', 'constantsRiesgosGenerales', 'constants'
], function (ng, constantsRiesgosGenerales, constants) {
  modalClonarController.$inject = ['mModalAlert', 'riesgosGeneralesService', 'riesgosGeneralesFactory'];
  function modalClonarController(mModalAlert, riesgosGeneralesService, riesgosGeneralesFactory) {
    var vm = this;
    vm.editClonacion = editClonacion
    vm.$onInit = function () {
      vm.constantsRrgg = constantsRiesgosGenerales;
      vm.clonar = {
        nombreProducto: vm.data.Descripcion
      }
    };
    function editClonacion() {
      var request = {
        TipoRegistro: 2,
        CodigoRiesgoGeneral: vm.data.CodigoRiesgoGeneral,
        NombreProducto: vm.clonar.nombreProducto,
      }
      riesgosGeneralesFactory.cotizacion.clonar = request
      riesgosGeneralesService.gestionClonacion(riesgosGeneralesFactory.getModelClonacion()).then(function (response) {
        if (response.OperationCode === constants.operationCode.success) {
          mModalAlert.showSuccess("Se edito el producto correctamente.", "GESTION PRODUCTO").then(function (rs) {
            vm.close();
          })
        }
      })
    }
  } // end controller
  return ng.module('appRrgg')
    .controller('modalClonarController', modalClonarController)
    .component('rrggModalClonar', {
      templateUrl: '/polizas/app/rrgg/components/modal-clonar/modal-clonar.html',
      controller: 'modalClonarController',
      bindings: {
        close: '&',
        data: "="
      }
    })
});
