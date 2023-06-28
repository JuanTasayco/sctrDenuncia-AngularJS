define([
  'angular', 'constants',
  '/gcw/app/factory/gcwFactory.js',
], function (ng, constants) {

  FexConsultController.$inject = ['gcwFactory'];

  function FexConsultController(gcwFactory) {
    var vm = this;

    vm.$onInit = function () {
      _getExternalLink();
    }
    
    function _getExternalLink() {
      gcwFactory.getExternalLink().then(function(response) {
        if (response.operationCode === constants.operationCode.success) {
          vm.url = response.data[0].value;
        }
      })
      .catch(function(error) {
        console.error('Error en getExternalLink',  error);
      });
    }

  } // end controller
  return ng.module('appGcw')
    .controller('FexConsultController', FexConsultController)
    .component('fexConsult', {
      templateUrl: '/gcw/app/components/cobranzas/templates/fex-consult.html',
      controller: 'FexConsultController as $ctrl',
      controllerAs: 'vm',
      bindings: {}
    });
});
