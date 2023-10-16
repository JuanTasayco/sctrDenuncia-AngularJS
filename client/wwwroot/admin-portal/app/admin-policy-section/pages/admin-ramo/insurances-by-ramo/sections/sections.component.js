'use strict';

define(['angular', 'coreConstants', 'system', 'lodash'], function (ng, coreConstants, system, _) {
  SectionsController.$inject = ['$rootScope'];
  function SectionsController($rootScope) {
    var vm = this;
    vm.$onInit = onInit;


    vm.showFrmAdd = showFrmAdd;
    vm.addSection = addSection;
    vm.editSection = editSection;
    vm.deleteSection = deleteSection;
    // vm.$onDestroy = onDestroy;
 
   
    function onInit() {
      vm.showAddFrm = false;
    }

    function showFrmAdd() {
      vm.showAddFrm = true;
    }

    function addSection(item) {
      vm.data.push(item)
      vm.showAddFrm = false;
    }

    function editSection(item,index) {
      vm.data[index] = item;
    }

    function deleteSection(index) {
      vm.data.splice(index, 1);
    }

    
  } // end controller

  return ng
    .module(coreConstants.ngMainModule)
    .controller('SectionsController', SectionsController)
    .component('wpSections', {
      templateUrl: '/admin-portal/app/admin-policy-section/pages/admin-ramo/insurances-by-ramo/sections/sections.component.html',
      controller: 'SectionsController',
      bindings: {
        data: '=?'
      }
    });
});
