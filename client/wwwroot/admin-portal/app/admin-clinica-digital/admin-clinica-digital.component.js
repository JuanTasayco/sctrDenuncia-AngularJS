'use strict';

define(['angular', 'coreConstants'], function (ng, coreConstants) {
    AdminClinicaDigitalComponent.$inject = ['options'];
    function AdminClinicaDigitalComponent(options) {
        var vm = this;
        vm.$onInit = onInit;
        
        function onInit() {
            vm.options = options;
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('AdminClinicaDigitalComponent', AdminClinicaDigitalComponent);
});
