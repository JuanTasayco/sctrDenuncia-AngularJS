'use strict';

define(['angular', 'coreConstants'], function (ng, coreConstants) {
    AdminRamoComponent.$inject = ['AdminRamoFactory', '$stateParams'];
    function AdminRamoComponent(AdminRamoFactory, $stateParams) {
        var vm = this;
        vm.$onInit = onInit;
        console.log("Init");

        function onInit() {
            console.log("Init");
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('AdminRamoComponent', AdminRamoComponent);
});
