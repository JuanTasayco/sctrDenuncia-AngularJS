'use strict';

define([
  'angular'
], function(ng) {

  ModalInfoController.$inject = ['$scope'];

  function ModalInfoController($scope) {
    var vm = this;

    vm.confirm = function() {
      vm.data.confirm = true
      vm.close();
    };
  }
  return ng.module('appAutos')
    .controller('ModalInfoController', ModalInfoController)
    .component('mpfModalInfo', {
      templateUrl: '/polizas/app/sctr/emitir/component/modalInfo.html',
      controller: 'ModalInfoController',
      bindings: {
        data: '=',
        close: '&'
      }
    });
});
