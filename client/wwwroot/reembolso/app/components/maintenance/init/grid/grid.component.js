'use strict';

define(['angular', 'lodash'], function (ng, _) {
  GridMaintenanceController.$inject = ['reFactory', '$q', '$log'];

  function GridMaintenanceController(reFactory, $q, $log) {
    var vm = this;
    vm.$onInit = onInit;
    vm.onCheck = onCheck;
    vm.onChangeState = onChangeState;
    vm.onEdit = onEdit;

    function onInit() {
    }

    function onCheck(item) {
      !item.isChecked;
      vm.onCheckCallback(item);
    }

    function onChangeState(item) {
      item.isActive = item.isActiveState ? '1' : '0';
      vm.onChangeStateCallback(item);
    }

    function onEdit(item) {
      item.isActiveState && vm.fnModal(item).result
        .then(function(data) {
          var val = _.assign({}, data, { isActive: item.isActive, lastSinisterNumber: item.lastSinisterNumber });
          vm.onEditCallback(val);
        })
        .catch(function(err) {
          $log.error(err);
        })
    }

  }

  return ng
    .module('appReembolso')
    .controller('GridMaintenanceController', GridMaintenanceController)
    .component('reGridMaintenance', {
      templateUrl: '/reembolso/app/components/maintenance/init/grid/grid.html',
      controller: 'GridMaintenanceController',
      bindings: {
        executivesList: '<',
        onCheckCallback: '<',
        onChangeStateCallback: '<',
        onEditCallback: '<',
        fnModal: '<',
        headerTable: '<',
        isSoat: '<'
      }
    })
})
