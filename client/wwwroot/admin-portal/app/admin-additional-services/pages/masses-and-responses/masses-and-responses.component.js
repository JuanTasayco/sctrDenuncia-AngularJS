'use strict';

define(['angular', 'coreConstants','lodash'], function (ng, coreConstants,_) {
    MassesAndResponsesComponent.$inject = ['$stateParams','GeneralAdditionalServiceFactory'];
    function MassesAndResponsesComponent($stateParams, GeneralAdditionalServiceFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.servicesSelected = {
            id: 1,
            name: 'MISAS Y REPONSOS',
            active: true,
            subServices:[
                {
                    code: 0,
                    lbl: "MISAS EN CAPILLA"
                },
                {
                    code: 1,
                    lbl: "RESPONSO EN SEPULTURA"
                }
            ]
        }

        function onInit() {
            vm.servicesSelected = GeneralAdditionalServiceFactory.getServiceSelected();
            vm.servicesSelected.subServices = _.map(vm.servicesSelected.subServices, function(p , index) {
                return { 
                    code: p.id,
                    lbl: p.nombre
                };
              })
            console.log("masess and responses",vm.servicesSelected)
            
            // vm.ramos = ramo
            // vm.sections = sections
            // AdminRamoFactory.setSections(sections);
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('MassesAndResponsesComponent', MassesAndResponsesComponent);
});
