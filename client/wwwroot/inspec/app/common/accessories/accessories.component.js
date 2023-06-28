'use strict';

define(['angular', 'lodash'], function(ng, _) {
  accessoriesController.$inject = ['$timeout'];
  function accessoriesController($timeout) {
    var vm = this;
    vm.$onInit = onInit;
    vm.createAccessory = createAccessory;
    vm.saveAccessory = saveAccessory;
    vm.editAccessory = editAccessory;
    vm.removeAccessory = removeAccessory;
    vm.closeForm = closeForm;

    function onInit() {
      vm.maxLength = 4;
      vm.editAccessoryIndex = -1;
      if (!vm.data) {
        vm.data = [];
      }
    }

    function createAccessory() {
      vm.duplicated = false;
      vm.showForm = true;
      vm.newAccessory = true;
    }

    function saveAccessory() {
      var isEdit = vm.editAccessoryIndex !== -1;
      vm.formData.markAsPristine();
      if (vm.stereo) {
        if (isInPriceRange()) {
          if (vm.formData.$valid) {
            if (!isDuplicated(isEdit, true)) {
              if (isEdit) {
                vm.data[vm.editAccessoryIndex].mAccessory = vm.formData.mAccessory;
                vm.data[vm.editAccessoryIndex].mDescription = vm.formData.mDescription.toUpperCase();
                vm.data[vm.editAccessoryIndex].mValue = vm.formData.mValue;
              } else {
                vm.data.push({
                  mAccessory: vm.formData.mAccessory,
                  mDescription: vm.formData.mDescription.toUpperCase(),
                  mValue: vm.formData.mValue
                });
              }
            } else {
              vm.duplicated = true;
              return;
            }
            closeForm();
          }
        }
      } else {
        if (vm.formData.$valid) {
          if (!isDuplicated(isEdit)) {
            if (vm.editAccessoryIndex !== -1) {
              vm.data[vm.editAccessoryIndex].mAccessory = vm.formData.mAccessory;
              vm.data[vm.editAccessoryIndex].mDescription = vm.formData.mDescription.toUpperCase();
              vm.data[vm.editAccessoryIndex].mValue = vm.formData.mValue;
            } else {
              vm.data.push({
                mAccessory: vm.formData.mAccessory,
                mDescription: vm.formData.mDescription.toUpperCase(),
                mValue: vm.formData.mValue
              });
            }
          } else {
            vm.duplicated = true;
            return;
          }
          closeForm();
        }
      }
    }

    function removeAccessory(index) {
      vm.data.splice(index, 1);
    }

    function editAccessory(index) {
      var data = ng.copy(vm.data[index]);
      vm.duplicated = false;
      vm.showForm = true;
      vm.newAccessory = false;
      vm.editAccessoryIndex = index;
      $timeout(function() {
        var index = -1;
        if (vm.stereo) {
          index = _.findIndex(vm.sourceList, function(accesory) {
            return accesory.accesoryId === data.mAccessory.accesoryId;
          });
        } else {
          index = _.findIndex(vm.sourceList, function(accesory) {
            return accesory.parameterId === data.mAccessory.parameterId;
          });
        }

        vm.formData.mAccessory = vm.sourceList[index];
        vm.formData.mDescription = data.mDescription;
        vm.formData.mValue = data.mValue;
      });
    }

    function closeForm() {
      vm.showForm = false;
      vm.newAccessory = false;
      vm.editAccessoryIndex = -1;
      vm.formData.mAccessory = null;
      vm.formData.mDescription = null;
      vm.formData.mValue = null;
    }

    function isDuplicated(isEdit, stereo) {
      var index = -1;
      if (stereo) {
        index = vm.data.findIndex(function(data) {
          return data.mAccessory.accesoryId === vm.formData.mAccessory.accesoryId;
        });
        return isEdit ? index !== vm.editAccessoryIndex : index !== -1;
      } else {
        index = vm.data.findIndex(function(data) {
          return data.mAccessory.parameterId === vm.formData.mAccessory.parameterId;
        });
        return isEdit ? index !== vm.editAccessoryIndex : index !== -1;
      }
    }

    function isInPriceRange() {
      return (
        vm.formData.mValue >= vm.formData.mAccessory.minPrice && vm.formData.mValue <= vm.formData.mAccessory.maxPrice
      );
    }
  }

  return ng
    .module('appInspec')
    .controller('AccessoriesController', accessoriesController)
    .component('inspecAccessories', {
      templateUrl: '/inspec/app/common/accessories/accessories.html',
      controller: 'AccessoriesController',
      controllerAs: '$ctrl',
      bindings: {
        title: '=',
        sourceList: '=',
        data: '=',
        stereo: '=?',
        disabled: '=',
        showOnly: '='
      }
    });
});
