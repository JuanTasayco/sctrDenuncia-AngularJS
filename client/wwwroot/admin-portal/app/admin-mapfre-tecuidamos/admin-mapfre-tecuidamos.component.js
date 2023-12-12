'use strict';

define(['angular', 'coreConstants'], function (ng, coreConstants) {
    AdminMapfreTecuidamosComponent.$inject = ['$stateParams','sections', 'AdminRamoFactory'];
    function AdminMapfreTecuidamosComponent($stateParams,sections, AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;
        
        function onInit() {
            vm.sections = sections
            AdminRamoFactory.setSections(sections);
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('AdminMapfreTecuidamosComponent', AdminMapfreTecuidamosComponent);
});
