define([
    'angular','constantsRiesgosGenerales'
  ], function (ng,constantsRiesgosGenerales) {
    contratanteController.$inject = ['mModalAlert','riesgosGeneralesService', 'riesgosGeneralesFactory'];
    function contratanteController(mModalAlert,riesgosGeneralesService, riesgosGeneralesFactory) {
      var vm = this;
      vm.$onInit = function () {
        vm.constantsRrgg =  constantsRiesgosGenerales;
      };
    } // end controller
    return ng.module('appRrgg')
      .controller('contratanteController', contratanteController)
      .component('contratante', {
        templateUrl: '/polizas/app/rrgg/components/contratante/contratante.component.html',
        controller: 'contratanteController',
        bindings: {
          contratante: '='
          }
      })
  });
  