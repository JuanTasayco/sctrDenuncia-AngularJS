'use strict';

define(['angular', 'coreConstants','lodash'], function (ng, coreConstants,_) {
    MassesAndResponsesComponent.$inject = ['$stateParams','GeneralAdditionalServiceFactory', 'AdminRamoFactory'];
    function MassesAndResponsesComponent($stateParams, GeneralAdditionalServiceFactory, AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;

        function onInit() {
            vm.servicesSelected = GeneralAdditionalServiceFactory.getServiceSelected();
            AdminRamoFactory.subsChangeRamo(changeRamo);
            vm.servicesSelected.subServices = _.map(vm.servicesSelected.subServices, function(p , index) {
                return { 
                    code: p.id,
                    lbl: p.nombre
                };
              })
            console.log("masess and responses",vm.servicesSelected)
            vm.selectedSubService = vm.servicesSelected.subServices[0].code;
        }

        function changeRamo(item) {
            vm.servicesSelected = item;
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('MassesAndResponsesComponent', MassesAndResponsesComponent);
});
