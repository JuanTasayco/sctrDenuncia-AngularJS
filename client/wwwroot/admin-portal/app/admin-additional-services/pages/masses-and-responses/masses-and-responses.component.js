'use strict';

define(['angular', 'coreConstants'], function (ng, coreConstants) {
    MassesAndResponsesComponent.$inject = ['$stateParams'];
    function MassesAndResponsesComponent($stateParams) {
        var vm = this;
        vm.$onInit = onInit;

        vm.tabs = [
            {
                code: 0,
                lbl: 'MISAS EN CAPILLA'
            },
            {
                code: 1,
                lbl: 'RESPONSO EN SEPULTURA'
            }
        ]
        
        function onInit() {
            // vm.ramos = ramo
            // vm.sections = sections
            // AdminRamoFactory.setSections(sections);
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('MassesAndResponsesComponent', MassesAndResponsesComponent);
});
