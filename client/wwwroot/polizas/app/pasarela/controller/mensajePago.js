'use strict';

define(['angular', 'lyra'], function(angular) {
  paymentMessagesController.$inject = ['$stateParams'];

  function paymentMessagesController($stateParams) {
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

  return angular.module('appAutos').controller('paymentMessagesController', paymentMessagesController);
});
