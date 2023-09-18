'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
  SectionController.$inject = ['$rootScope'];
  function SectionController($rootScope) {
    var vm = this;
    vm.$onInit = onInit;

    vm.editSection = editSection;
    vm.handleOnDelete = handleOnDelete;
   
    function onInit() {
    }


    function editSection(item) {
      vm.onEditar({$event: item});
      vm.showEditFrm = false;
    }

    function handleOnDelete(){
      vm.onDelete();
    }
    
  } // end controller

  return ng
    .module(coreConstants.ngMainModule)
    .controller('SectionController', SectionController)
    .component('wpSection', {
      templateUrl: '/admin-portal/app/admin-policy-section/pages/admin-ramo/insurances-by-ramo/sections/section/section.component.html',
      controller: 'SectionController',
      bindings: {
        section: '=?',
        onDelete: '&?',
        onEditar: '&?',
        index: '=?'
      }
    });
});
