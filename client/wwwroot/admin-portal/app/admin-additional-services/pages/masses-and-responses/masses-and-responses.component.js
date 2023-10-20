'use strict';

define(['angular', 'coreConstants','lodash'], function (ng, coreConstants,_) {
    MassesAndResponsesComponent.$inject = ['$stateParams','MassesAndResponsesFactory', 'AdminRamoFactory'];
    function MassesAndResponsesComponent($stateParams, MassesAndResponsesFactory, AdminRamoFactory) {
        var vm = this;
        vm.$onInit = onInit;
        vm.onTabSubService = onTabSubService;

        function onInit() {
            vm.servicesSelected = MassesAndResponsesFactory.getServiceSelected();
            AdminRamoFactory.subsChangeRamo(changeRamo);
            vm.servicesSelected.subServices = _.map(vm.servicesSelected.subServices, function(p , index) {
                return { 
                    code: p.id,
                    lbl: p.nombre
                };
              })
            console.log("masess and responses",vm.servicesSelected)
            vm.selectedSubService = vm.servicesSelected.subServices[0];
            
            setTimeout(function () {
                vm.onTabSubService(vm.selectedSubService);
            }, 333);
            
        }

        function changeRamo(item) {
            vm.servicesSelected = item;
            vm.onTabSubService(vm.selectedSubService);
        }

        function onTabSubService(item){
            console.log('setSubServiceSelected',item);
            vm.selectedSubService = item;
            MassesAndResponsesFactory.setSubServiceSelected(item);
            MassesAndResponsesFactory.emitChangeSubService(item);
        }

    } // end controller

    return ng.module(coreConstants.ngMainModule).controller('MassesAndResponsesComponent', MassesAndResponsesComponent);
});
