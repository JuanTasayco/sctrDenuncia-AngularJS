'use strict';

define(['angular', 'lyra'], function(angular) {
  pagadoController.$inject = ['$stateParams'];

  function pagadoController($stateParams) {
    var vm = this;

    vm.$onInit = onInit;
    vm.$onDestroy = onDestroy;
    vm.showSummary = true;

    function onInit() {
      if ($stateParams.params) {
        vm.dataSummary = $stateParams.params.summary;
      }
    }
    function onDestroy() {}
  } // end

  return angular.module('appAutos').controller('pagadoController', pagadoController);
});
