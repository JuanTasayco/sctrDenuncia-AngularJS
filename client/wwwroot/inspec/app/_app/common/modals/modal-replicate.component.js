'use strict';

define(['angular'], function(ng) {
  modalReplicateController.$inject = [
    '$scope',
    '$uibModalInstance',
    'modalTitle',
    'buttonText',
    'associedFleet',
    'selectedRequests',
    'riskId'
  ];

  function modalReplicateController(
    $scope,
    $uibModalInstance,
    modalTitle,
    buttonText,
    associedFleet,
    selectedRequests,
    riskId
  ) {
    var vm = this;
    vm.$onInit = onInit;
    vm.selectAll = selectAll;
    vm.selectOne = selectOne;
    vm.saveData = saveData;
    vm.riskId = +riskId;
    vm.trueValue = true;
    vm.filter = filter;
    vm.showOnlySelected = showOnlySelected;
    vm.clearFilter = clearFilter;

    function onInit() {
      vm.closeModal = closeModal;
      vm.modalTitle = modalTitle;
      vm.buttonText = buttonText;
      vm.associedFleet = associedFleet;
      vm.selected = selectedRequests.length > 0 ? selectedRequests : [];
      if (vm.selected.length > 0) {
        checkAll();
      }
      vm.selected.push(vm.riskId);
      vm.pagination = {
        pageSize: 10
      };
      setFirstPage();
    }

    function closeModal() {
      unCheckAll();
      $uibModalInstance.close();
    }

    function checkAll() {
      ng.forEach(vm.selected, function(value) {
        var found = vm.associedFleet.find(function(request) {
          return value === request.riskId;
        });
        if (found) {
          found.checked = true;
        }
      });
    }

    function unCheckAll() {
      ng.forEach(vm.selected, function(value) {
        var found = vm.associedFleet.find(function(request) {
          return value === request.riskId;
        });
        if (found) {
          found.checked = false;
        }
      });
    }

    function selectAll(collection) {
      if (vm.selected.length > 0 && vm.selected.length !== vm.associedFleet.length) {
        ng.forEach(collection, function(value) {
          var found = vm.selected.indexOf(value.riskId);
          if (found === -1) {
            vm.selected.push(value.riskId);
          }
        });
        checkAll();
      } else {
        unCheckAll();
        vm.selected = [];
        vm.selected.push(vm.riskId);
      }
    }

    function selectOne(id) {
      var found = vm.selected.indexOf(id);
      if (found === -1) {
        vm.selected.push(id);
      } else {
        vm.selected.splice(found, 1);
      }
    }

    function saveData() {
      $uibModalInstance.close(vm.selected);
    }

    function filter() {
      vm.associedFleet = new jinqJs()
        .from(associedFleet)
        .where(function(row) {
          vm.search.contactFullName = vm.search.contactFullName || '';
          vm.search.vehicleBrand = vm.search.vehicleBrand || '';
          vm.search.vehicleModel = vm.search.vehicleModel || '';
          vm.search.vehicleLicensePlate = vm.search.vehicleLicensePlate || '';
          return (
            row.contactFullName.indexOf(vm.search.contactFullName.toUpperCase()) !== -1 &&
            row.vehicleBrand.indexOf(vm.search.vehicleBrand.toUpperCase()) !== -1 &&
            row.vehicleModel.indexOf(vm.search.vehicleModel.toUpperCase()) !== -1 &&
            row.vehicleLicensePlate.indexOf(vm.search.vehicleLicensePlate.toUpperCase()) !== -1
          );
        })
        .select();
      setFirstPage();
    }

    function showOnlySelected() {
      vm.associedFleet = new jinqJs()
        .from(associedFleet)
        .where(function(row) {
          return row.checked === true || row.riskId === vm.riskId;
        })
        .select();
      setFirstPage();
    }

    function clearFilter() {
      vm.associedFleet = associedFleet;
      vm.search = {};
      setFirstPage();
    }

    function setFirstPage() {
      vm.pagination.totalItems = vm.associedFleet.length;
      vm.pagination.currentPage = 1;
      vm.isAllSelected = vm.selected.length === vm.associedFleet.length;
    }

    $scope.$watchCollection(
      function() {
        return vm.selected;
      },
      function(newVal) {
        vm.isAllSelected = newVal.length === vm.associedFleet.length;
      }
    );
  }

  return ng.module('appInspec').controller('ModalReplicateController', modalReplicateController);
});
