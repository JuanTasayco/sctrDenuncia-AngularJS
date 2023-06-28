'use strict';

define(['angular', 'constants'], function(ng, constants) {
  groupPolizeController.$inject = ['inspecFactory'];

  function groupPolizeController(inspecFactory) {
    var vm = this;
    vm.$onInit = onInit;
    vm.searchGroupPolize = searchGroupPolize;
    vm.closeGroupPolize = closeGroupPolize;

    function onInit() {
      if (angular.isDefined(vm.data)) {
        vm.data.errorGroupPolize = false;
        vm.data.showGroupPolize = false;
      }
    }

    function clearGroupPolize() {
      if (angular.isDefined(vm.data)) {
        vm.data.groupPolize = '';
        vm.data.groupPolizeDescription = '';
      }
    }

    function searchGroupPolize(groupPolize) {
      clearGroupPolize();
      onInit();
      if (groupPolize && groupPolize !== '') {
        inspecFactory.vehicle.getPoliza(groupPolize).then(function(response) {
          if (response.OperationCode == constants.operationCode.success) {
            vm.data.groupPolize = response.Data.PolizaGrupo;
            vm.data.groupPolizeDescription = response.Data.NombrePolizaGrupo;
            vm.data.showGroupPolize = true;
          } else {
            //204 - éxito, pero no existe NombrePoliza
            if (vm.data) {
              vm.data.errorGroupPolize = true;
            }
          }
        });
      } else {
        //204 - éxito, pero no existe NombrePoliza
        if (vm.data) {
          vm.data.errorGroupPolize = true;
        }
      }
    }

    function closeGroupPolize() {
      clearGroupPolize();
      searchGroupPolize();
    }
  }

  return ng
    .module('appInspec')
    .controller('GroupPolizeController', groupPolizeController)
    .component('inspecGroupPolize', {
      templateUrl: '/inspec/app/_app/common/group-polize/group-polize.html',
      controller: 'GroupPolizeController',
      controllerAs: '$ctrl',
      bindings: {
        data: '='
      }
    });
});
