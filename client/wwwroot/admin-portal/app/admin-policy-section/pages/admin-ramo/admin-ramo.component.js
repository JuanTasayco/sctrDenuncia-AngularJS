'use strict';

define(['angular', 'coreConstants'], function (ng, coreConstants) {
    AdminRamoComponent.$inject = ['AdminRamoFactory', '$stateParams','ramo','sections'];
    function AdminRamoComponent(AdminRamoFactory, $stateParams,ramo,sections) {
        var vm = this;
        vm.$onInit = onInit;
        
        function onInit() {
            vm.ramos = ramo
            console.log("ramos",vm.ramos)
            vm.sections = sections
            AdminRamoFactory.setSections(sections);
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('AdminRamoComponent', AdminRamoComponent);
});
