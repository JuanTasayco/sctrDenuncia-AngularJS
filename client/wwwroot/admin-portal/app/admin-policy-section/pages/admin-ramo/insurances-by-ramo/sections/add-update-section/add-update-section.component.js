'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
  AddEditSectionController.$inject = ['$rootScope'];
  function AddEditSectionController($rootScope) {
    var vm = this;
    vm.$onInit = onInit;

    vm.cancel = cancel;
    vm.addItem = addItem;
    vm.saveFrm = saveFrm;
    vm.handleOnDelete = handleOnDelete;
   
    function onInit() {
      vm.frm = {
        items: [],
        titulo: null
      };
      vm.array = []
      vm.frmTitle = vm.isFrmAdd ? 'Agregar sección' : 'Editar sección';
      !vm.isFrmAdd && assignDataToModel();
    }

    function assignDataToModel() {
      vm.frm = _.assign({}, vm.section)
      vm.array = _.map(vm.section.items, function (p) {
        return {
          value: p
        }
      }) || [];
    }

    function cancel(){
      vm.onCancel();
    }

    function addItem(){
      vm.array.push({value: null});
    }

    function handleOnDelete(index){
      vm.array.splice(index, 1);
    }

    function saveFrm(){
      if (vm.frmSection.$invalid) {
        vm.frmSection.markAsPristine();
        return void 0;
      }

      vm.frm.items = _.map(vm.array, function (p) {
        return p.value
      });
      vm.onSave({$event: vm.frm});
    }

    
  } // end controller

  return ng
    .module(coreConstants.ngMainModule)
    .controller('AddEditSectionController', AddEditSectionController)
    .component('wpAddEditSection', {
      templateUrl: '/admin-portal/app/admin-policy-section/pages/admin-ramo/insurances-by-ramo/sections/add-update-section/add-update-section.component.html',
      controller: 'AddEditSectionController',
      bindings: {
        isFrmAdd: '<?',
        section: '<?',
        onSave: '&?',
        onCancel: '&?'
      }
    });
});
