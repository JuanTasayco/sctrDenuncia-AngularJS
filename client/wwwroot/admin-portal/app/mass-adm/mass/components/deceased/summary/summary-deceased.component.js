'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function(ng, coreConstants, system, _) {
  var folder = system.apps.ap.location;

  SummaryDeceasedController.$inject = ['$scope'/*, 'AddBannerFactory'*/];
  function SummaryDeceasedController($scope) {
    var vm = this;
    vm.$onDestroy = onDestroy;

    function onDestroy() {
        // console.log("destroy");
    }

    function cancel() {
      vm.onShow();
    }
    
    function handleEdit(item) {
        item.edit = true;
        // vm.onEdit(item);
    }

    function deleteItem(item) {
      vm.onDelete({
        $arg: item
      });
    }

    vm.handleEdit = handleEdit;
    vm.cancel = cancel;
    vm.deleteItem = deleteItem;

  } // end controller
  return ng
    .module(coreConstants.ngMainModule)
    .controller('SummaryDeceasedController', SummaryDeceasedController)
    .component('summaryDeceasedComponent', {
      templateUrl: folder + '/app/mass-adm/mass/components/deceased/summary/summary-deceased.component.html',
      controller: 'SummaryDeceasedController',
      bindings: {
        data: '=?',
        onShow: '&?',
        onEdit: '&?',
        onDelete: '&',
        readonly: '=?'
      }
    });
});
